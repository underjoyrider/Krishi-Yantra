# KrishiYantra (कृषियन्त्र)

> **Real-Time Agricultural Procurement Queue & Slot Management Platform**  
> *"Know your slot. Skip the wait."* — Turning unpredictable procurement mandi waiting into structured, predictable appointments for Indian farmers.

---

## 🌾 Overview

During peak harvest seasons, farmers often travel long distances to agricultural procurement centers (APMC mandis) without knowing whether the center is operating at capacity, how many farmers are waiting ahead of them, or how long they will wait. This leads to chaotic bottlenecks, multi-day wait times, spoilage risks, and wasted days for farmers.

**KrishiYantra** is a full-stack digital queue and appointment management solution designed for the Smart India Hackathon (SIH) prototype. It empowers:
- **Farmers**: Discover procurement centers, view real-time queue lengths and wait times, book 30-minute procurement slots, receive digital tokens with QR codes, track queue status in real time, and receive proximity notifications.
- **Mandi Operators & Staff**: Manage counter flow with 1-click token promotions ("Call Next", "Complete"), control center capacity, monitor throughput, and resolve farmer queries.

---

## ✨ Key Features

1. **Aadhaar-Based Identity Verification (Demo Simulation)**:
   - Simplified 12-digit Aadhaar input with formatted visual grouping (`XXXX XXXX XXXX`) and mandatory consent confirmation.
   - Built with privacy-first design: Aadhaar numbers are hashed using SHA-256 and never stored in plain text.
2. **Mobile-First Trilingual Farmer UI**:
   - Built to feel like a native mobile app (390px responsive viewport).
   - Real-time language switcher supporting **English**, **हिंदी (Hindi)**, and **ಕನ್ನಡ (Kannada)**.
3. **Transparent Rule-Based Wait Time Engine**:
   $$\text{Estimated Wait} = \frac{\text{Farmers Ahead} \times \text{Average Processing Time (5 min)}}{\text{Active Counters}}$$
4. **Atomic Slot Booking & Digital Token Generation**:
   - Prevents double-booking during peak rush hours via atomic database updates.
   - Generates sequential tokens (e.g. `B-104`) with dynamic QR codes for physical counter check-ins.
5. **Real-Time Queue Tracking (`/farmer/queue/:bookingId`)**:
   - Bi-directional WebSockets (Socket.IO) push live updates to the farmer's screen the second a counter operator calls the next token.
   - Automatic 3-second polling fallback ensures connectivity even in rural low-bandwidth conditions.
6. **Booking Management & Cancellation Flow**:
   - Dedicated booking review page allowing farmers to securely cancel upcoming bookings and release slots back to the public queue.
7. **Staff Operations Desk (`/staff/dashboard` & `/staff/queue`)**:
   - Operator control panel with 1-click `Call Next`, `Complete`, and queue simulations for live presentations.
   - Real-time queue metrics and throughput charts powered by Recharts.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Node.js, Express 4, Next.js API Layer
- **Real-Time Communication**: Socket.IO (WebSockets with automatic HTTP polling fallback)
- **Database & ORM**: Prisma ORM with SQLite (zero-setup local database, PostgreSQL compatible)
- **Verification & QR**: Dynamic QR Code generation (`qrcode`), SHA-256 identity hashing

---

## ⚙️ Prerequisites

- **Node.js**: v18.x or v20.x installed
- **npm**: v9.x or higher

---

## 🚀 Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/KrishiYantra.git
cd KrishiYantra
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file to create your local `.env`:
```bash
# On Linux/macOS:
cp .env.example .env

# On Windows (PowerShell):
Copy-Item .env.example .env
```

Review `.env` to verify the default settings:
```env
DATABASE_URL="file:./dev.db"
PORT=3000
NEXT_PUBLIC_API_URL="http://localhost:3000"
SOCKET_URL="http://localhost:3000"
NOTIFICATION_PROVIDER="mock"
```

### 4. Initialize the Database & Seed Mock Data
```bash
# Generate Prisma client
npm run prisma:generate

# Push database schema to local SQLite database
npm run prisma:push

# Seed realistic demo farmers, staff, and procurement centers
npm run prisma:seed

# Import the supplied queue/ETA CSV into QueueObservation records
npm run prisma:import-csv
```

### 5. Start the Application Server
```bash
npm run dev
```

The application will start at: **`http://localhost:3000`**
- **Farmer Portal / Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Farmer Dashboard**: [http://localhost:3000/farmer/dashboard](http://localhost:3000/farmer/dashboard)
- **Staff Operations Dashboard**: [http://localhost:3000/staff/dashboard](http://localhost:3000/staff/dashboard)

### Portal Login

- **Portal chooser**: [http://localhost:3000/login](http://localhost:3000/login)
- **Farmer login/signup**: [http://localhost:3000/farmer/login](http://localhost:3000/farmer/login)
- **Vendor login/signup**: [http://localhost:3000/vendor/login](http://localhost:3000/vendor/login)

Farmer and vendor accounts are saved in the Prisma `User` table. Passwords are stored as salted hashes. The CSV import stores the queue observations from `sih backend 26/ml/dataset/sih_queue_wait_time_dataset_2000.csv` in the Prisma `QueueObservation` table.

---

## 🎯 Demo & Prototype Information

### 1-Click Instant Demo Profiles
On the `/login` screen, instant access buttons allow seamless demonstration for judges and evaluators without manual data entry:
- **Demo Farmer (Ravi Kumar)**:
  - Phone: `9876543210`
  - Aadhaar: Pre-linked demo credentials
  - Active Booking: **B-104** at Shivapur Procurement Center (Position #4, Paddy/Rice)
- **Demo Staff (Shivapur Center Operator)**:
  - Access to live counter operations, Call Next, and queue analytics

### Recommended Demonstration Walkthrough
1. Open `http://localhost:3000/login` in Tab 1 and click **Demo Farmer (Ravi Kumar)**.
2. View Ravi's upcoming booking card (`B-104`, Position #4, ~20 min wait).
3. Click **"Track My Queue"** to view live progress.
4. In Tab 2, open `http://localhost:3000/staff/queue`.
5. Click **"Call Next"** or **"⚡ Simulate Next Farmer"** on the staff desk.
6. Switch back to Tab 1: observe the queue position immediately decrement from **#4 → #3** with updated proximity notifications.

---

## ⚠️ Important Note on Demo & Simulated Features

> [!NOTE]
> This repository represents a working prototype developed for the **Smart India Hackathon (SIH)**.
> - **Aadhaar Identity Verification**: Designed to demonstrate the exact UX, consent mechanics, and SHA-256 hashed storage of a UIDAI-compatible integration. Actual UIDAI biometric / OTP production APIs require government licensing (AUA/KUA) and are simulated in this prototype.
> - **SMS / WhatsApp / Voice Notifications**: The project includes a pluggable notification architecture (`src/lib/notifications.ts`). In development and demo modes, notifications are handled by an in-memory/console mock service (`NOTIFICATION_PROVIDER="mock"`). Real-world SMS delivery can be enabled by configuring valid Twilio credentials (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, etc.).
