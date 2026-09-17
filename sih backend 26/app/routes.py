import os
import requests
from datetime import date, time

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import get_db
from .models import (
    User,
    ProcurementCenter,
    Slot,
    Booking,
    Procurement,
    Payment,
    Notification,
    CropSupply,
    VendorRequest,
)
from .schemas import (
    RegisterRequest,
    LoginRequest,
    CenterCreate,
    SlotCreate,
    BookingCreate,
    ProcurementCreate,
    PaymentCreate,
    CropSupplyCreate,
    VendorRequestCreate,
    VendorRequestUpdate,
)
from .auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter()

ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://127.0.0.1:8001")


# ============================================================
# helper
# ============================================================
def notify(db: Session, user_id: int, title: str, message: str):
    db.add(Notification(user_id=user_id, title=title, message=message))
    db.commit()


# ============================================================
# AUTH
# ============================================================
@router.post("/auth/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if data.role not in ("farmer", "vendor"):
        raise HTTPException(400, "Role must be farmer or vendor")

    if db.query(User).filter(User.phone_number == data.phone_number).first():
        raise HTTPException(400, "Phone number already registered")

    user = User(
        full_name=data.full_name,
        phone_number=data.phone_number,
        password_hash=hash_password(data.password),
        role=data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "Registration successful", "user": {
        "id": user.id, "full_name": user.full_name,
        "phone_number": user.phone_number, "role": user.role
    }}


@router.post("/auth/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_number == data.phone_number).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Invalid phone number or password")

    token = create_access_token(user.id, user.role)

    return {"access_token": token, "token_type": "bearer", "user": {
        "id": user.id, "full_name": user.full_name,
        "phone_number": user.phone_number, "role": user.role
    }}


@router.get("/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id, "full_name": current_user.full_name,
        "phone_number": current_user.phone_number, "role": current_user.role
    }


# ============================================================
# PROCUREMENT CENTRES
# ============================================================
@router.post("/centers")
def create_center(data: CenterCreate, db: Session = Depends(get_db)):
    center = ProcurementCenter(
        name=data.name,
        location=data.location,
        address=data.address,
        opening_time=time.fromisoformat(data.opening_time),
        closing_time=time.fromisoformat(data.closing_time),
        active=1,
    )
    db.add(center)
    db.commit()
    db.refresh(center)
    return {"message": "Centre created", "center_id": center.id}


@router.get("/centers")
def get_centers(db: Session = Depends(get_db)):
    centers = db.query(ProcurementCenter).filter(ProcurementCenter.active == 1).all()
    return [
        {
            "id": c.id, "name": c.name, "location": c.location,
            "address": c.address, "opening_time": str(c.opening_time),
            "closing_time": str(c.closing_time),
        }
        for c in centers
    ]


# ============================================================
# SLOTS  (bug fixed: was duplicated twice before)
# ============================================================
@router.post("/centers/{center_id}/slots")
def create_slot(center_id: int, data: SlotCreate, db: Session = Depends(get_db)):
    center = db.query(ProcurementCenter).filter(ProcurementCenter.id == center_id).first()
    if not center:
        raise HTTPException(404, "Procurement centre not found")

    try:
        slot = Slot(
            center_id=center_id,
            slot_date=date.fromisoformat(data.slot_date),
            start_time=time.fromisoformat(data.start_time),
            end_time=time.fromisoformat(data.end_time),
            capacity=data.capacity,
            booked_count=0,
        )
        db.add(slot)
        db.commit()
        db.refresh(slot)
        return {"message": "Slot created", "slot_id": slot.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(400, str(e))


@router.get("/centers/{center_id}/slots")
def get_slots(center_id: int, db: Session = Depends(get_db)):
    center = db.query(ProcurementCenter).filter(ProcurementCenter.id == center_id).first()
    if not center:
        raise HTTPException(404, "Procurement centre not found")

    slots = db.query(Slot).filter(Slot.center_id == center_id).all()
    return [
        {
            "id": s.id, "slot_date": str(s.slot_date),
            "start_time": str(s.start_time), "end_time": str(s.end_time),
            "capacity": s.capacity, "booked_count": s.booked_count,
            "available_slots": s.capacity - s.booked_count,
        }
        for s in slots
    ]


# ============================================================
# BOOKING + TOKENS
# ============================================================
@router.post("/bookings")
def create_booking(
    data: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "farmer":
        raise HTTPException(403, "Only farmers can create bookings")

    slot = db.query(Slot).filter(
        Slot.id == data.slot_id, Slot.center_id == data.center_id
    ).first()
    if not slot:
        raise HTTPException(404, "Slot not found")
    if slot.booked_count >= slot.capacity:
        raise HTTPException(400, "Slot is full")

    existing = db.query(Booking).filter(
        Booking.farmer_id == current_user.id,
        Booking.slot_id == data.slot_id,
        Booking.status.in_(["WAITING", "SERVING"]),
    ).first()
    if existing:
        raise HTTPException(400, "You already have a booking for this slot")

    token_number = slot.booked_count + 1
    booking = Booking(
        farmer_id=current_user.id,
        center_id=data.center_id,
        slot_id=data.slot_id,
        token_number=token_number,
        status="WAITING",
    )
    slot.booked_count += 1
    db.add(booking)
    db.commit()
    db.refresh(booking)

    notify(db, current_user.id, "Booking confirmed",
           f"Your token number is {token_number}.")

    return {"message": "Booking successful", "booking_id": booking.id,
            "token_number": token_number}


# ============================================================
# QUEUE
# ============================================================
@router.get("/queue/status/{booking_id}")
def get_queue_status(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id, Booking.farmer_id == current_user.id
    ).first()
    if not booking:
        raise HTTPException(404, "Booking not found")

    people_ahead = db.query(Booking).filter(
        Booking.slot_id == booking.slot_id,
        Booking.token_number < booking.token_number,
        Booking.status == "WAITING",
    ).count()

    return {
        "booking_id": booking.id, "token_number": booking.token_number,
        "status": booking.status, "people_ahead": people_ahead,
        "estimated_wait_time_minutes": people_ahead * 10,
    }


# ============================================================
# ETA  (calls the separate ML microservice; falls back if it's down)
# ============================================================
@router.get("/queue/eta/{booking_id}")
def get_eta(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(
        Booking.id == booking_id, Booking.farmer_id == current_user.id
    ).first()
    if not booking:
        raise HTTPException(404, "Booking not found")

    people_ahead = db.query(Booking).filter(
        Booking.slot_id == booking.slot_id,
        Booking.token_number < booking.token_number,
        Booking.status == "WAITING",
    ).count()

    queue_length = db.query(Booking).filter(
        Booking.slot_id == booking.slot_id, Booking.status == "WAITING"
    ).count()

    ml_data = {
        "centre_id": str(booking.center_id), "centre_name": "Procurement Centre",
        "tokens_ahead": people_ahead, "queue_length": queue_length,
        "active_counters": 1, "hour_of_day": 10, "day_of_week": 1,
        "peak_hour": 0, "crop": "Rice", "quantity_kg": 100,
        "quality_grade": "A", "staff_experience_years": 5,
        "processing_time_min": 10,
    }

    try:
        response = requests.post(f"{ML_SERVICE_URL}/predict-eta", json=ml_data, timeout=5)
        response.raise_for_status()
        eta_minutes = response.json()["estimated_wait_time_minutes"]
    except requests.RequestException:
        # ML service unreachable -> fall back to the simple estimate
        eta_minutes = people_ahead * 10

    return {
        "booking_id": booking.id, "token_number": booking.token_number,
        "people_ahead": people_ahead,
        "estimated_wait_time_minutes": eta_minutes,
    }


# ============================================================
# PROCUREMENT  (staff records the actual purchase at the counter)
# ============================================================
@router.post("/procurements")
def create_procurement(
    data: ProcurementCreate,
    db: Session = Depends(get_db),
):
    booking = db.query(Booking).filter(Booking.id == data.booking_id).first()
    if not booking:
        raise HTTPException(404, "Booking not found")

    total_amount = data.quantity * data.rate

    procurement = Procurement(
        booking_id=booking.id,
        farmer_id=booking.farmer_id,
        crop_name=data.crop_name,
        quantity=data.quantity,
        rate=data.rate,
        quality_grade=data.quality_grade,
        total_amount=total_amount,
        status="COMPLETED",
    )
    booking.status = "COMPLETED"

    db.add(procurement)
    db.commit()
    db.refresh(procurement)

    notify(db, booking.farmer_id, "Procurement recorded",
           f"{data.quantity}kg of {data.crop_name} purchased for ₹{total_amount}.")

    return {"message": "Procurement recorded", "procurement_id": procurement.id,
            "total_amount": total_amount}


@router.get("/procurements/mine")
def my_procurements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.query(Procurement).filter(Procurement.farmer_id == current_user.id).all()
    return [
        {
            "id": p.id, "crop_name": p.crop_name, "quantity": p.quantity,
            "rate": p.rate, "total_amount": p.total_amount, "status": p.status,
        }
        for p in rows
    ]


# ============================================================
# PAYMENTS
# ============================================================
@router.post("/payments")
def create_payment(
    data: PaymentCreate,
    db: Session = Depends(get_db),
):
    procurement = db.query(Procurement).filter(
        Procurement.id == data.procurement_id
    ).first()
    if not procurement:
        raise HTTPException(404, "Procurement not found")

    payment = Payment(
        procurement_id=procurement.id,
        farmer_id=procurement.farmer_id,
        amount=procurement.total_amount,
        status="PAID",
        transaction_reference=data.transaction_reference,
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    notify(db, procurement.farmer_id, "Payment received",
           f"₹{payment.amount} has been paid for your procurement.")

    return {"message": "Payment recorded", "payment_id": payment.id}


@router.get("/payments/mine")
def my_payments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.query(Payment).filter(Payment.farmer_id == current_user.id).all()
    return [
        {"id": p.id, "amount": p.amount, "status": p.status,
         "transaction_reference": p.transaction_reference}
        for p in rows
    ]


# ============================================================
# NOTIFICATIONS
# ============================================================
@router.get("/notifications")
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()

    return [
        {"id": n.id, "title": n.title, "message": n.message,
         "is_read": bool(n.is_read), "created_at": str(n.created_at)}
        for n in rows
    ]


@router.patch("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    n = db.query(Notification).filter(
        Notification.id == notification_id, Notification.user_id == current_user.id
    ).first()
    if not n:
        raise HTTPException(404, "Notification not found")

    n.is_read = 1
    db.commit()
    return {"message": "Marked as read"}


# ============================================================
# VENDOR  (farmers list crop supply, vendors browse + request it)
# ============================================================
@router.post("/crop-supplies")
def create_crop_supply(
    data: CropSupplyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "farmer":
        raise HTTPException(403, "Only farmers can list crop supply")

    supply = CropSupply(
        farmer_id=current_user.id,
        crop_name=data.crop_name,
        quantity=data.quantity,
        unit=data.unit,
        location=data.location,
        available=1,
    )
    db.add(supply)
    db.commit()
    db.refresh(supply)
    return {"message": "Crop supply listed", "crop_supply_id": supply.id}


@router.get("/crop-supplies")
def browse_crop_supplies(crop_name: str | None = None, db: Session = Depends(get_db)):
    q = db.query(CropSupply).filter(CropSupply.available == 1)
    if crop_name:
        q = q.filter(CropSupply.crop_name.ilike(f"%{crop_name}%"))

    return [
        {
            "id": s.id, "crop_name": s.crop_name, "quantity": s.quantity,
            "unit": s.unit, "location": s.location, "farmer_id": s.farmer_id,
        }
        for s in q.all()
    ]


@router.post("/vendor-requests")
def create_vendor_request(
    data: VendorRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "vendor":
        raise HTTPException(403, "Only vendors can request crop supply")

    supply = db.query(CropSupply).filter(
        CropSupply.id == data.crop_supply_id, CropSupply.available == 1
    ).first()
    if not supply:
        raise HTTPException(404, "Crop supply not found or no longer available")

    req = VendorRequest(
        vendor_id=current_user.id,
        farmer_id=supply.farmer_id,
        crop_supply_id=supply.id,
        crop_name=supply.crop_name,
        requested_quantity=data.requested_quantity,
        status="PENDING",
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    notify(db, supply.farmer_id, "New vendor request",
           f"A vendor requested {data.requested_quantity}{supply.unit} of {supply.crop_name}.")

    return {"message": "Request sent", "vendor_request_id": req.id}


@router.get("/vendor-requests/mine")
def my_vendor_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Farmers see requests made on their crop supply.
    # Vendors see requests they made.
    if current_user.role == "farmer":
        rows = db.query(VendorRequest).filter(VendorRequest.farmer_id == current_user.id).all()
    else:
        rows = db.query(VendorRequest).filter(VendorRequest.vendor_id == current_user.id).all()

    return [
        {
            "id": r.id, "crop_name": r.crop_name,
            "requested_quantity": r.requested_quantity, "status": r.status,
        }
        for r in rows
    ]


@router.patch("/vendor-requests/{request_id}")
def update_vendor_request(
    request_id: int,
    data: VendorRequestUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.status not in ("ACCEPTED", "REJECTED"):
        raise HTTPException(400, "Status must be ACCEPTED or REJECTED")

    req = db.query(VendorRequest).filter(
        VendorRequest.id == request_id, VendorRequest.farmer_id == current_user.id
    ).first()
    if not req:
        raise HTTPException(404, "Request not found")

    req.status = data.status
    if data.status == "ACCEPTED":
        supply = db.query(CropSupply).filter(CropSupply.id == req.crop_supply_id).first()
        if supply:
            supply.available = 0

    db.commit()

    notify(db, req.vendor_id, "Request update",
           f"Your request for {req.crop_name} was {data.status.lower()}.")

    return {"message": f"Request {data.status.lower()}"}
