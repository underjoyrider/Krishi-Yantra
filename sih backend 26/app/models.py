from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    Time,
    DateTime,
    Float,
    ForeignKey,
    Text
)
from sqlalchemy.sql import func

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    phone_number = Column(String(15), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="farmer")


class ProcurementCenter(Base):
    __tablename__ = "procurement_centers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    location = Column(String(150), nullable=False)
    address = Column(Text, nullable=False)
    opening_time = Column(Time, nullable=False)
    closing_time = Column(Time, nullable=False)
    active = Column(Integer, default=1)


class Slot(Base):
    __tablename__ = "slots"

    id = Column(Integer, primary_key=True, index=True)
    center_id = Column(Integer, ForeignKey("procurement_centers.id"), nullable=False)
    slot_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    capacity = Column(Integer, nullable=False, default=20)
    booked_count = Column(Integer, nullable=False, default=0)


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    center_id = Column(Integer, ForeignKey("procurement_centers.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("slots.id"), nullable=False)

    token_number = Column(Integer, nullable=False)
    status = Column(String(20), default="WAITING")

    created_at = Column(DateTime, server_default=func.now())


class Procurement(Base):
    __tablename__ = "procurements"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    crop_name = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    rate = Column(Float, nullable=False)
    quality_grade = Column(String(10), nullable=False)

    total_amount = Column(Float, nullable=False)
    status = Column(String(30), default="COMPLETED")

    created_at = Column(DateTime, server_default=func.now())


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    procurement_id = Column(Integer, ForeignKey("procurements.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    amount = Column(Float, nullable=False)
    status = Column(String(30), default="PENDING")
    transaction_reference = Column(String(100), nullable=True)

    created_at = Column(DateTime, server_default=func.now())


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)

    is_read = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())


class CropSupply(Base):
    __tablename__ = "crop_supplies"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    crop_name = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), default="kg")
    location = Column(String(150), nullable=False)

    available = Column(Integer, default=1)
    created_at = Column(DateTime, server_default=func.now())


class VendorRequest(Base):
    __tablename__ = "vendor_requests"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_supply_id = Column(Integer, ForeignKey("crop_supplies.id"), nullable=False)

    crop_name = Column(String(100), nullable=False)
    requested_quantity = Column(Float, nullable=False)

    status = Column(String(30), default="PENDING")
    created_at = Column(DateTime, server_default=func.now())