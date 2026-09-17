from pydantic import BaseModel, Field


# ---------- Auth ----------
class RegisterRequest(BaseModel):
    full_name: str
    phone_number: str = Field(min_length=10, max_length=15)
    password: str = Field(min_length=6)
    role: str = "farmer"


class LoginRequest(BaseModel):
    phone_number: str
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    phone_number: str
    role: str

    class Config:
        from_attributes = True


# ---------- Centres & Slots ----------
class CenterCreate(BaseModel):
    name: str
    location: str
    address: str
    opening_time: str
    closing_time: str


class SlotCreate(BaseModel):
    slot_date: str
    start_time: str
    end_time: str
    capacity: int = 20


# ---------- Booking ----------
class BookingCreate(BaseModel):
    center_id: int
    slot_id: int


# ---------- Procurement ----------
class ProcurementCreate(BaseModel):
    booking_id: int
    crop_name: str
    quantity: float
    rate: float
    quality_grade: str = "A"


# ---------- Payments ----------
class PaymentCreate(BaseModel):
    procurement_id: int
    transaction_reference: str | None = None


# ---------- Vendor ----------
class CropSupplyCreate(BaseModel):
    crop_name: str
    quantity: float
    unit: str = "kg"
    location: str


class VendorRequestCreate(BaseModel):
    crop_supply_id: int
    requested_quantity: float


class VendorRequestUpdate(BaseModel):
    status: str  # ACCEPTED or REJECTED
