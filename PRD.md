# MEDIT OPERATIONS MANAGEMENT SYSTEM
## Product Requirements Document (PRD) v1.0
**Document Version:** 1.0
**Date:** June 18, 2026
**Client:** Alan - Medit CEO
**Status:** Phase 1 - Architecture & Setup
**Platform:** Next.js + Supabase + Vercel

---

## TABLE OF CONTENTS
1. Executive Summary
2. Product Overview
3. Features & Functionality
4. Pricing Model
5. Data Import & Migration
6. Technical Architecture
7. Database Schema
8. API Specifications
9. UI/UX Requirements
10. Security & Authentication
11. Success Criteria
12. Implementation Timeline

---

## 1. EXECUTIVE SUMMARY

### Project Vision
Build a comprehensive web-based operations management system for Medit, a specialized assisted mobility transportation company in Santo Domingo, Dominican Republic. The platform will:
- Enable clients to self-calculate transportation fares in real-time
- Provide Alan with complete operational visibility and control
- Track expenses by vehicle and category
- Manage driver compensation (base salary + overtime + meals)
- Generate weekly financial reports with KPI analytics
- Import and migrate historical business data

### Key Facts
- **Base Fare:** 1,250 DOP (Updated from 1,200)
- **Service Types:** 8 different transportation services
- **Active Vehicles:** 3+ vehicles (expandable)
- **Drivers:** 2+ drivers with custom compensation models
- **Reporting:** Weekly automated summaries
- **Currency:** Dominican Pesos (DOP)
- **Location:** Santo Domingo, Dominican Republic

### Business Drivers
1. Need for transparent, real-time pricing for clients
2. Accurate operational cost tracking by vehicle
3. Fair driver compensation with overtime tracking
4. Data-driven decision making through weekly reports
5. Consolidation of business data from Google Sheets to unified platform

---

## 2. PRODUCT OVERVIEW

### 2.1 Two-Sided Platform Architecture

#### PUBLIC SIDE: Client Fare Calculator
An internet-facing tool where clients can estimate transportation costs before requesting a ride.

**Functionality:**
- Pickup location input with Google Maps autocomplete
- Destination address input with Google Maps autocomplete
- Service type selection (8 options: Medical, Post-Surgery, Pre-Surgery, Airport, Therapy, Events, Recreational, Pickup/Dropoff)
- Trip type selector: One-way or Round-trip
- Private vs Public option (Public = going to metro station to use Meditiko)
- Additional fees: Delivery/transportation, stairs, elevator usage
- Real-time fare calculation using Google Maps data
- Estimated cost display in Dominican Pesos
- Contact information form (optional: name, phone)

**User Flow:**
1. Client visits calculator page
2. Enters pickup and destination addresses
3. Google Maps calculates distance and duration
4. Client selects service type and trip options
5. System calculates fare based on formula
6. Client sees breakdown: base, distance, time, waiting, additional fees
7. Client contacts business via WhatsApp/phone to confirm booking

#### PRIVATE SIDE: Admin Dashboard
Internal management system for Alan to run the business.

**Functionality:**
- Trip logging and management
- Real-time expense tracking
- Driver management and payroll
- Vehicle fleet management
- Weekly financial reporting
- KPI tracking and analytics
- Data import from Google Sheets
- Excel/Google Sheets export

**User Access:**
- Alan only (email/password authentication)
- Password-protected pages
- Session management

---

## 3. FEATURES & FUNCTIONALITY

### 3.1 PUBLIC FARE CALCULATOR

#### Feature: Address Selection with Google Maps
- Pickup address field with autocomplete
- Destination address field with autocomplete
- Ability to select from suggested addresses
- Support for business names, street addresses, landmarks
- Save recent locations (future enhancement)

#### Feature: Service Type Selection
Select from 8 pre-defined service types:
1. Cita Medica (Medical Appointment)
2. Post Cirugia (Post-Surgery)
3. Pre Cirugia (Pre-Surgery)
4. Aeropuerto (Airport)
5. Terapia (Therapy)
6. Eventos (Events)
7. Recreativa (Recreational)
8. Subir/Bajar (Pickup/Dropoff)

#### Feature: Trip Type Options
- One-way: Standard point-to-point
- Round-trip: Includes waiting time at destination

#### Feature: Transportation Mode
- Private: Standard service
- Public: Using Meditiko (electric vehicle, cost may vary)

#### Feature: Additional Fees
- Delivery/Transportation fee
- Stairs/Accessibility fee
- Elevator fee
- Flexible add-on system

#### Feature: Real-Time Price Calculation

**Pricing Formula:**
```
TOTAL FARE = Base + Distance + Duration + Waiting (if roundtrip) + Additional Fees

Base:                    1,250 DOP
Distance Cost:           (km × 2 × 35) DOP
Duration Cost:           (minutes × 2 × 15) DOP
Waiting Cost (roundtrip): (hours × 350) DOP
Additional Fees:         TBD per category
```

Example Calculation:
- Pickup: Calle A, Santo Domingo
- Destination: Las Americas Airport
- Distance: 35 km
- Duration: 120 minutes
- Trip Type: Round-trip
- Waiting: 1 hour
- Service: Airport Transport
- Mode: Private

```
Total = 1,250 + (35×2×35) + (120×2×15) + (1×350)
      = 1,250 + 2,450 + 3,600 + 350
      = 7,650 DOP
```

#### Feature: Fare Breakdown Display
Show itemized breakdown:
- Base fare: X DOP
- Distance cost: X DOP
- Time cost: X DOP
- Waiting time cost: X DOP (if applicable)
- Additional fees: X DOP
- **Total estimated: X DOP**

#### Feature: Client Contact Form (Optional)
- Name field
- Phone number field
- Submitted with fare quote
- Data stored for follow-up

---

### 3.2 ADMIN DASHBOARD

#### Feature: Trip Management

**Log New Trip**
- Date and time
- Service type (dropdown)
- Client name
- Client phone
- Pickup location (Google Maps autocomplete)
- Destination (Google Maps autocomplete)
- Assigned driver (dropdown)
- Vehicle used (dropdown)
- Trip type: One-way/Round-trip
- Waiting hours (if round-trip)
- Automatic fare calculation
- Trip status: Pending/Completed/Cancelled

**Trip List View**
- Sortable columns: Date, Service, Client, Driver, Vehicle, Fare, Status
- Filter by: Date range, Service type, Driver, Vehicle, Status
- Edit trip
- Delete trip
- Mark complete
- View trip details

**Trip Analysis**
- Total trips (daily, weekly, monthly)
- Revenue by service type
- Revenue by vehicle
- Revenue by driver
- Average fare
- Utilization metrics

#### Feature: Expense Tracking

**Log New Expense**
- Date
- Category: Gas, Maintenance, Insurance, Vehicle Registration, Tolls, Repairs
- Vehicle (dropdown)
- Amount in DOP
- Description/Notes
- Optional receipt attachment

**Expense List View**
- Sortable columns: Date, Category, Vehicle, Amount, Notes
- Filter by: Date range, Category, Vehicle
- Edit expense
- Delete expense
- View expense details

**Expense Analysis**
- Total expenses (daily, weekly, monthly)
- Expenses by category
- Expenses by vehicle
- Cost per kilometer
- Cost per trip

#### Feature: Vehicle Management

**Add/Edit Vehicle**
- Vehicle name/ID
- Vehicle type (KYC V7, Nissan Serena, EV, etc.)
- License plate
- Fuel consumption (km/liter)
- Current km reading
- Status (Active/Inactive)
- Purchase date (optional)
- Notes

**Vehicle Dashboard**
- List all vehicles
- Individual vehicle performance cards:
  - Total trips
  - Total revenue
  - Total expenses
  - Cost per km
  - Fuel efficiency
  - Status

**Vehicle Analysis**
- Compare vehicles by revenue
- Compare vehicles by expenses
- Identify cost outliers
- Fuel efficiency trends

#### Feature: Driver Management

**Add/Edit Driver**
- Driver name
- Custom base monthly salary (DOP)
- Overtime hourly rate (DOP)
- Vehicles assigned
- Contact information
- Start date
- Status (Active/Inactive)

**Driver Dashboard**
- List all drivers
- Current month compensation summary:
  - Base salary
  - Overtime hours worked
  - Overtime pay
  - Diet allowances (morning: 100 DOP, evening: 200 DOP)
  - Total compensation

**Driver Analytics**
- Performance metrics
- Trips per driver
- Revenue per driver
- Compensation trends
- Overtime patterns

#### Feature: Service Management

**View 8 Service Types**
- Cita Medica
- Post Cirugia
- Pre Cirugia
- Aeropuerto
- Terapia
- Eventos
- Recreativa
- Subir/Bajar

**Edit Service Details** (future enhancement)
- Service name
- Description
- Custom pricing rules (optional)
- Availability

---

### 3.3 REPORTING & ANALYTICS

#### Weekly Automated Reports

**Revenue Report**
- Total weekly revenue
- Revenue by service type
- Revenue by vehicle
- Revenue by driver
- Day-by-day breakdown
- Year-to-date comparison

**Expense Report**
- Total weekly expenses
- Expenses by category (Gas, Maintenance, Insurance, Registration, Tolls, Repairs)
- Expenses by vehicle
- Day-by-day breakdown

**Profitability Report**
- Gross revenue
- Total expenses
- Net profit
- Profit margin %
- Profit per vehicle
- Profit per service type
- Cost per kilometer
- Vehicle utilization rate (%)

**Driver Payroll Report**
- Each driver's compensation:
  - Base salary
  - Overtime hours
  - Overtime pay
  - Diet allowances breakdown
  - Total compensation
- Total payroll for week/month

**KPI Dashboard**
- Total revenue (weekly, monthly, YTD)
- Total expenses (weekly, monthly, YTD)
- Net profit (weekly, monthly, YTD)
- Average fare per trip
- Cost per kilometer (by vehicle)
- Profit margin % (by vehicle, by service)
- Vehicle utilization rate %
- Driver productivity metrics

#### Report Export Options
- Excel format (.xlsx)
- Google Sheets (direct export)
- PDF (print-ready)
- Email weekly summary (future enhancement)

#### Report Filters
- By date range
- By vehicle
- By driver
- By service type
- By expense category

---

### 3.4 DATA IMPORT FROM GOOGLE SHEETS

#### Import Functionality

**One-Time Historical Import**
Import existing trip data from Google Sheets to populate system with historical records.

**Required Columns:**
- `date` (YYYY-MM-DD format)
- `price` (numeric, DOP)
- `service_type` (must match 8 service types)
- `client_name` (string)

**Optional Columns:**
- `vehicle` (vehicle name/ID)
- `driver` (driver name)
- `notes` (additional information)

**Import Process:**
1. Admin uploads CSV file from Google Sheets
2. System validates data format
3. System checks for duplicates
4. System maps service types
5. Data imported into `trips` table
6. Confirmation report generated
7. Manual adjustments available if needed

**Data Validation:**
- Date format validation
- Price numeric validation
- Service type matching against 8 known types
- Duplicate detection (by date, price, client, service type)
- Client name validation

**Conflict Resolution:**
- Skip duplicates
- Overwrite existing records
- Manual review before import

---

## 4. PRICING MODEL

### 4.1 Fare Calculation Formula

**Updated Base Fare: 1,250 DOP** (previously 1,200)

```
TOTAL FARE = Base + Distance + Duration + Waiting + Additional Fees

Components:
1. Base Fare: 1,250 DOP (flat, charged for every trip)

2. Distance Cost: (Kilometers × 2 × 35) DOP
   - Kilometers: Actual distance from pickup to destination (Google Maps)
   - Multiplier: 2
   - Rate: 35 DOP per km per multiplier
   - Formula: km × 2 × 35 = km × 70 DOP/km

3. Duration Cost: (Minutes × 2 × 15) DOP
   - Minutes: Estimated duration from Google Maps
   - Multiplier: 2
   - Rate: 15 DOP per minute per multiplier
   - Formula: min × 2 × 15 = min × 30 DOP/min

4. Waiting Time Cost: (Hours × 350) DOP (Round-trip only)
   - Hours: Client-specified waiting time at destination
   - Rate: 350 DOP per hour
   - Only applied for round-trip bookings
   - Optional field

5. Additional Fees: Category-based, optional
   - Delivery/Transportation: TBD
   - Stairs/Accessibility: TBD
   - Elevator fee: TBD
   - Other special requests: TBD
```

### 4.2 Pricing Examples

**Example 1: Medical Appointment (One-way)**
- Distance: 12 km
- Duration: 35 minutes
- Service: Cita Medica
- Type: One-way
- Additional fees: None

Calculation:
- Base: 1,250
- Distance: (12 × 2 × 35) = 840
- Duration: (35 × 2 × 15) = 1,050
- Waiting: 0 (one-way)
- Additional: 0
- **Total: 3,140 DOP**

**Example 2: Airport Transport (Round-trip)**
- Distance: 35 km
- Duration: 120 minutes
- Waiting: 1.5 hours
- Service: Aeropuerto
- Type: Round-trip
- Additional fees: None

Calculation:
- Base: 1,250
- Distance: (35 × 2 × 35) = 2,450
- Duration: (120 × 2 × 15) = 3,600
- Waiting: (1.5 × 350) = 525
- Additional: 0
- **Total: 7,825 DOP**

**Example 3: Post-Surgery with Accessibility**
- Distance: 8 km
- Duration: 25 minutes
- Waiting: 0 (one-way)
- Service: Post Cirugia
- Type: One-way
- Additional: Stairs/Accessibility fee (50 DOP)

Calculation:
- Base: 1,250
- Distance: (8 × 2 × 35) = 560
- Duration: (25 × 2 × 15) = 750
- Waiting: 0
- Additional: 50
- **Total: 2,610 DOP**

### 4.3 Private vs Public Option

**Private Mode:**
- Standard Medit service
- Uses assigned vehicle
- Full pricing applies

**Public Mode:**
- Client travels to metro station via Meditiko
- Lower base fare possible (TBD - future refinement)
- Used for long-distance efficiency
- May include metro coordination fee

---

## 5. DATA IMPORT & MIGRATION

### 5.1 Google Sheets to Supabase Migration

#### Historical Data Import

**Source Data:**
- Google Sheets with columns: date, price, service_type, client_name

**Target:**
- Supabase `trips` table with imported records

**Process:**
1. **Preparation**
   - Export Google Sheets as CSV
   - Include headers: date, price, service_type, client_name
   - Ensure date format: YYYY-MM-DD
   - Ensure price is numeric (DOP)

2. **Upload**
   - Admin clicks "Import Data" in dashboard
   - Selects CSV file from computer
   - Preview data before import

3. **Validation**
   - Check date format (must be YYYY-MM-DD)
   - Check price is numeric
   - Validate service_type against 8 known types
   - Detect duplicates by: date + price + client_name + service_type

4. **Mapping**
   - Map service_type to internal service IDs
   - Map client_name to create initial records
   - Handle missing optional fields

5. **Import**
   - User confirms import
   - System processes and validates all records
   - Inserts into database with timestamps
   - Generates import report

6. **Verification**
   - Show import summary: X records imported, Y duplicates skipped, Z errors
   - Allow user to review imported records
   - Provide download of import log

#### One-Time Nature
- Import happens once on system setup
- After import, all new data entered through app
- Option to re-import with "skip duplicates" or "overwrite" mode

---

## 6. TECHNICAL ARCHITECTURE

### 6.1 Technology Stack

```
FRONTEND:
- Framework: Next.js 14+
- UI Library: React 18+
- Styling: Tailwind CSS 3+
- Maps: Google Maps JavaScript API
- State Management: React Hooks / Context API
- Forms: React Hook Form
- Data Export: xlsx library
- UI Components: Custom components + shadcn/ui

BACKEND:
- Database: Supabase (PostgreSQL 13+)
- Authentication: Supabase Auth
- API: Next.js API Routes
- Real-time: Supabase Realtime (optional)
- File Storage: Supabase Storage

DEPLOYMENT:
- Hosting: Vercel
- Domain: Custom domain (TBD)
- CDN: Vercel Edge Network
- SSL/TLS: Automatic (Vercel)

EXTERNAL SERVICES:
- Google Maps API (Distance Matrix, Directions, Places)
- Supabase Postgres Database
- Vercel Hosting

DEVELOPMENT:
- Version Control: Git
- Repository: GitHub
- Package Manager: npm
- Build Tool: Next.js (integrated)
```

### 6.2 Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│         CLIENT DEVICES (Browsers)               │
│  - Desktop                                       │
│  - Mobile (responsive)                           │
│  - Tablet                                        │
└────────────────┬────────────────────────────────┘
                  │
         ┌────────▼─────────────┐
         │   VERCEL (CDN)        │
         │   - Static Assets     │
         │   - Next.js Build     │
         └────────┬─────────────┘
                  │
     ┌────────────┴───────────┬──────────────┐
     │                        │              │
┌────▼─────────┐  ┌──────────▼─────┐  ┌────▼─────┐
│ PUBLIC SITE  │  │  ADMIN PANEL   │  │  API     │
│ - Calculator │  │  - Dashboard   │  │ Routes   │
│ - Static     │  │  - Reports     │  │          │
│ - No Auth    │  │  - Auth        │  │ Business │
│              │  │                │  │ Logic    │
└──────────────┘  └────────────────┘  └──────────┘
                  │
     ┌────────────▼────────────┐
     │   SUPABASE               │
     │  ┌────────────────┐      │
     │  │ PostgreSQL DB  │      │
     │  │ - users        │      │
     │  │ - trips        │      │
     │  │ - expenses     │      │
     │  │ - drivers      │      │
     │  │ - vehicles     │      │
     │  │ - services     │      │
     │  │ - reports      │      │
     │  └────────────────┘      │
     │  ┌────────────────┐      │
     │  │ Realtime Subs  │      │
     │  │ (optional)     │      │
     │  └────────────────┘      │
     └────────────────────────┘
          │
     ┌────▼─────┐
     │ GOOGLE   │
     │ Maps API │
     └──────────┘
```

### 6.3 Data Flow

```
PUBLIC CALCULATOR:
1. Client enters addresses → Google Maps Autocomplete
2. Google Maps calculates distance/duration
3. JavaScript calculates fare locally
4. Client sees estimated cost
5. Client contacts business or calls

ADMIN DASHBOARD:
1. Alan logs in → Supabase Auth
2. Dashboard loads → Fetches data from Supabase
3. Alan enters new trip → Stored in trips table
4. System auto-calculates fare → Google Maps API
5. Weekly reports generated → SQL queries on Supabase
6. Reports exported → Excel / Google Sheets

DATA IMPORT:
1. Alan uploads CSV from Google Sheets
2. Next.js API route validates data
3. Data inserted into trips table
4. Confirmation returned to user

EXPENSE TRACKING:
1. Alan logs expense → Stored in expenses table
2. Filters applied → Query by vehicle/category/date
3. Analysis computed → Aggregations in reports
4. Exported → Excel format
```

---

## 7. DATABASE SCHEMA

### 7.1 Complete Schema

```sql
-- users table (Authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'user'
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- services table (8 Service Types)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE, -- Cita Medica, Post Cirugia, etc.
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- vehicles table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- Vehicle ID or name
  type VARCHAR(100), -- KYC V7, Nissan Serena, EV, etc.
  license_plate VARCHAR(20) UNIQUE,
  fuel_consumption DECIMAL(10, 2), -- km per liter
  current_km DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'maintenance'
  purchase_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- drivers table
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  base_monthly_salary DECIMAL(12, 2), -- Custom per driver in DOP
  overtime_hourly_rate DECIMAL(10, 2), -- DOP per hour
  diet_morning_allowance DECIMAL(10, 2) DEFAULT 100, -- DOP
  diet_evening_allowance DECIMAL(10, 2) DEFAULT 200, -- DOP
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive'
  start_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- driver_vehicles (many-to-many)
CREATE TABLE driver_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  assigned_date DATE DEFAULT CURRENT_DATE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- trips table
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time TIME NOT NULL,
  service_id UUID REFERENCES services(id),
  client_name VARCHAR(255),
  client_phone VARCHAR(20),
  pickup_address TEXT NOT NULL,
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  destination_address TEXT NOT NULL,
  destination_lat DECIMAL(10, 8),
  destination_lng DECIMAL(11, 8),
  driver_id UUID REFERENCES drivers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  distance_km DECIMAL(10, 2), -- From Google Maps
  duration_minutes INT, -- From Google Maps
  trip_type VARCHAR(50), -- 'one-way', 'round-trip'
  transportation_mode VARCHAR(50) DEFAULT 'private', -- 'private', 'public'
  waiting_hours DECIMAL(10, 2) DEFAULT 0, -- For round-trip
  base_fare DECIMAL(12, 2) DEFAULT 1250, -- DOP
  distance_cost DECIMAL(12, 2),
  duration_cost DECIMAL(12, 2),
  waiting_cost DECIMAL(12, 2) DEFAULT 0,
  additional_fees DECIMAL(12, 2) DEFAULT 0,
  total_fare DECIMAL(12, 2), -- Final calculated fare
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'gas', 'maintenance', 'insurance', 'registration', 'tolls', 'repairs'
  vehicle_id UUID REFERENCES vehicles(id),
  amount DECIMAL(12, 2) NOT NULL, -- DOP
  description TEXT,
  receipt_url VARCHAR(500), -- Optional file upload
  status VARCHAR(50) DEFAULT 'recorded', -- 'recorded', 'verified'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- driver_compensation table (Payroll tracking)
CREATE TABLE driver_compensation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- YYYY-MM-01
  base_salary DECIMAL(12, 2),
  overtime_hours DECIMAL(10, 2) DEFAULT 0,
  overtime_pay DECIMAL(12, 2) DEFAULT 0,
  diet_allowance_morning_count INT DEFAULT 0, -- Days worked morning
  diet_allowance_evening_count INT DEFAULT 0, -- Days worked evening
  diet_allowance_total DECIMAL(12, 2) DEFAULT 0,
  total_compensation DECIMAL(12, 2),
  paid_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid'
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(driver_id, month)
);

-- reports table (Cache weekly reports)
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type VARCHAR(50), -- 'weekly', 'monthly', 'custom'
  period_start DATE,
  period_end DATE,
  report_data JSONB, -- Store report metrics as JSON
  generated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- import_logs table (Track data imports)
CREATE TABLE import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255),
  total_records INT,
  imported_records INT,
  skipped_records INT,
  error_records INT,
  import_data JSONB, -- Store errors/warnings
  status VARCHAR(50), -- 'in_progress', 'completed', 'failed'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 7.2 Key Relationships

```
users
  ├─ owns trips (indirectly through authorization)
  └─ owns reports

services
  └─ has many trips

vehicles
  ├─ has many trips
  ├─ has many expenses
  └─ has many driver_vehicles (through join table)

drivers
  ├─ has many trips
  ├─ has many driver_vehicles (through join table)
  └─ has many driver_compensation

trips
  ├─ belongs to service
  ├─ belongs to driver
  └─ belongs to vehicle

expenses
  └─ belongs to vehicle

driver_vehicles (join table)
  ├─ belongs to driver
  └─ belongs to vehicle

driver_compensation
  └─ belongs to driver
```

---

## 8. API SPECIFICATIONS

### 8.1 Authentication Endpoints

```
POST /api/auth/login
- Request: { email: string, password: string }
- Response: { user: User, token: JWT, expires_at: timestamp }
- Status: 200 (success), 401 (invalid credentials)

POST /api/auth/logout
- Status: 200 (success)

GET /api/auth/user
- Response: { user: User }
- Requires: Authorization header with JWT
- Status: 200 (success), 401 (unauthorized)

POST /api/auth/refresh-token
- Request: { refresh_token: string }
- Response: { token: JWT, expires_at: timestamp }
- Status: 200 (success), 401 (invalid refresh token)
```

### 8.2 Trip Endpoints

```
GET /api/trips
- Query: ?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&status=pending&driver_id=UUID
- Response: { trips: Trip[], total: number }
- Requires: Auth

POST /api/trips
- Request: Trip object
- Response: { id: UUID, ...trip_data }
- Requires: Auth
- Triggers: Google Maps API call for distance/duration

GET /api/trips/:id
- Response: { trip: Trip }
- Requires: Auth

PUT /api/trips/:id
- Request: Partial Trip object
- Response: { trip: Trip }
- Requires: Auth

DELETE /api/trips/:id
- Response: { success: boolean }
- Requires: Auth

POST /api/trips/calculate-fare
- Request: { pickup_lat, pickup_lng, destination_lat, destination_lng, ... }
- Response: { distance_km, duration_min, base_fare, distance_cost, duration_cost, total_fare }
- Public (no auth required)
```

### 8.3 Expense Endpoints

```
GET /api/expenses
- Query: ?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&category=gas&vehicle_id=UUID
- Response: { expenses: Expense[], total: number }
- Requires: Auth

POST /api/expenses
- Request: Expense object
- Response: { id: UUID, ...expense_data }
- Requires: Auth

PUT /api/expenses/:id
- Request: Partial Expense object
- Response: { expense: Expense }
- Requires: Auth

DELETE /api/expenses/:id
- Response: { success: boolean }
- Requires: Auth
```

### 8.4 Report Endpoints

```
GET /api/reports/weekly
- Query: ?week_of=YYYY-MM-DD
- Response: { revenue, expenses, profit, kpis, by_vehicle, by_service, by_driver }
- Requires: Auth

GET /api/reports/profitability
- Query: ?vehicle_id=UUID
- Response: { revenue, expenses, profit_margin, cost_per_km, utilization_rate }
- Requires: Auth

GET /api/reports/payroll
- Query: ?month=YYYY-MM
- Response: { drivers: { id, name, salary, overtime, meals, total }, grand_total }
- Requires: Auth

POST /api/reports/export
- Request: { report_type: 'weekly' | 'monthly', format: 'excel' | 'csv' }
- Response: { download_url: string }
- Requires: Auth
```

### 8.5 Vehicle Endpoints

```
GET /api/vehicles
- Response: { vehicles: Vehicle[] }
- Requires: Auth

POST /api/vehicles
- Request: Vehicle object
- Response: { id: UUID, ...vehicle_data }
- Requires: Auth

PUT /api/vehicles/:id
- Request: Partial Vehicle object
- Response: { vehicle: Vehicle }
- Requires: Auth

GET /api/vehicles/:id/analytics
- Response: { total_trips, total_revenue, total_expenses, efficiency_metrics }
- Requires: Auth
```

### 8.6 Driver Endpoints

```
GET /api/drivers
- Response: { drivers: Driver[] }
- Requires: Auth

POST /api/drivers
- Request: Driver object
- Response: { id: UUID, ...driver_data }
- Requires: Auth

PUT /api/drivers/:id
- Request: Partial Driver object
- Response: { driver: Driver }
- Requires: Auth

GET /api/drivers/:id/compensation
- Query: ?month=YYYY-MM
- Response: { driver: Driver, salary, overtime, meals, total }
- Requires: Auth

POST /api/drivers/:id/log-overtime
- Request: { hours: number, date: DATE }
- Response: { success: boolean }
- Requires: Auth
```

### 8.7 Import Endpoints

```
POST /api/import/trips
- Request: FormData with CSV file
- Response: { total_records, imported, skipped, errors, import_id }
- Requires: Auth

GET /api/import/:import_id
- Response: { status, progress, errors: [] }
- Requires: Auth

POST /api/import/:import_id/confirm
- Request: { action: 'confirm' | 'cancel' }
- Response: { status: 'completed', records_imported: number }
- Requires: Auth
```

---

## 9. UI/UX REQUIREMENTS

### 9.1 Public Fare Calculator Page

**Layout:**
- Full-width, responsive design
- Hero section with title: "Calculate Your Ride Cost"
- Single-column form in card layout
- Light, accessible color scheme
- No authentication required
- Mobile-first design

**Form Fields:**
1. Pickup Location (text input with Google Maps autocomplete)
2. Destination (text input with Google Maps autocomplete)
3. Service Type (dropdown select)
4. Trip Type (radio buttons: One-way / Round-trip)
5. Transportation Mode (radio buttons: Private / Public)
6. Waiting Hours (number input, shown if round-trip selected)
7. Additional Fees (checkboxes: Delivery, Stairs, Elevator)
8. Contact Info (optional: Name, Phone)

**Results Display:**
- Fare breakdown card
- Itemized costs
- Total estimated fare in large text
- "Confirm Booking" button (opens WhatsApp or phone)

**Responsive:**
- Desktop: 2-column layout (form left, results right)
- Tablet: Stacked 1-column
- Mobile: Full-width, scrollable

---

### 9.2 Admin Dashboard

**Navigation:**
- Sidebar with main sections:
  - Dashboard (overview)
  - Trips
  - Expenses
  - Vehicles
  - Drivers
  - Reports
  - Settings
  - Logout

**Dashboard Page:**
- Quick stats cards: Weekly revenue, expenses, profit, KPIs
- Recent trips widget (last 5 trips)
- Recent expenses widget
- Weekly chart (revenue vs expenses)
- Vehicle utilization gauge

**Trips Page:**
- Table view with columns: Date, Service, Client, Driver, Vehicle, Fare, Status
- Filters: Date range, Service, Driver, Vehicle, Status
- Actions: Add new, Edit, Delete, View details
- Search by client name

**Expenses Page:**
- Table view with columns: Date, Category, Vehicle, Amount, Notes
- Filters: Date range, Category, Vehicle
- Actions: Add new, Edit, Delete
- Total expenses display

**Vehicles Page:**
- Card grid view showing:
  - Vehicle name & type
  - License plate
  - Status (active/inactive)
  - Quick stats: Trips, Revenue, Expenses
- Actions per card: Edit, View analytics
- Add new vehicle button

**Drivers Page:**
- Table view: Name, Vehicle, Base Salary, Status
- Filters: Status, Vehicle assigned
- Actions: Edit, View compensation, Log overtime
- Add new driver button

**Reports Page:**
- Date selector (week/month)
- Report type selector
- Display: Revenue, Expenses, Profitability, Payroll
- Export buttons: Excel, CSV, PDF
- Charts: Revenue trends, Expense breakdown

---

### 9.3 Design System

**Colors:**
- Primary: Blue (#185FA5)
- Secondary: Teal (#1D9E75)
- Neutral: Gray (#444441)
- Success: Green (#639922)
- Warning: Amber (#BA7517)
- Danger: Red (#E24B4A)

**Typography:**
- Headings: Sans-serif, 500 weight, 16px-22px
- Body: Sans-serif, 400 weight, 16px
- Monospace: For numbers/codes

**Components:**
- Input fields: 12px padding, 8px border-radius
- Buttons: 12px padding, 6px border-radius
- Cards: 12px padding, 12px border-radius, subtle shadow
- Tables: Alternating row colors, hover state

---

## 10. SECURITY & AUTHENTICATION

### 10.1 Authentication System

**Method:** Supabase Auth with Email/Password

**Credentials:**
- Alan: Single user
- Email: (TBD)
- Password: Secure (minimum 12 characters, mix of uppercase, lowercase, numbers, symbols)

**Session Management:**
- JWT tokens
- 1-hour session timeout
- Automatic logout on tab close
- Session persistence: localStorage encrypted

### 10.2 Data Security

**Encryption:**
- HTTPS/TLS for all traffic
- Data at rest: Supabase encryption
- API keys: Environment variables, never in client code

**Access Control:**
- Row-level security (RLS) in Supabase
- Only Alan's user ID can access their data
- No multi-tenant concerns (single user)

**Privacy:**
- No sensitive data in URLs
- Passwords hashed (bcrypt via Supabase)
- No API keys exposed to client
- GDPR-style data handling

### 10.3 API Security

**Rate Limiting:**
- 100 requests/minute per IP
- Google Maps API: Restricted to domain
- Vercel built-in rate limiting

**CORS:**
- Only Vercel domain allowed
- No cross-origin requests from third parties

**Input Validation:**
- All inputs validated server-side
- No SQL injection (Supabase parameterized queries)
- File upload scanning for CSV import

---

## 11. SUCCESS CRITERIA

### 11.1 Functional Requirements

- [ ] Base fare: 1,250 DOP implemented
- [ ] Distance calculation via Google Maps
- [ ] Duration calculation via Google Maps
- [ ] Waiting time calculation for round-trips
- [ ] Additional fees support
- [ ] Accurate fare total display
- [ ] Address autocomplete (Google Maps)
- [ ] Service type selection (8 options)
- [ ] Trip type option (one-way / round-trip)
- [ ] Transportation mode (private / public)
- [ ] Real-time price calculation
- [ ] Fare breakdown display
- [ ] Mobile responsive
- [ ] Trip logging and management
- [ ] Expense tracking by vehicle/category
- [ ] Vehicle management
- [ ] Driver management
- [ ] Payroll tracking
- [ ] Weekly report generation
- [ ] CSV import from Google Sheets
- [ ] Historical data migration
- [ ] Duplicate detection
- [ ] Data validation
- [ ] Error reporting
- [ ] Weekly revenue report
- [ ] Weekly expense report
- [ ] Profitability analysis
- [ ] Cost per kilometer
- [ ] Profit margin calculation
- [ ] Utilization rate
- [ ] Driver payroll summary
- [ ] Export to Excel/Google Sheets

### 11.2 Technical Requirements

- [ ] Next.js 14+ setup
- [ ] Supabase PostgreSQL database
- [ ] Vercel deployment
- [ ] Google Maps API integration
- [ ] Supabase Auth implementation
- [ ] All tables created
- [ ] Relationships defined
- [ ] Indexes on key columns
- [ ] RLS policies configured
- [ ] Backups enabled
- [ ] Dashboard load time < 2 seconds
- [ ] Report generation < 5 seconds
- [ ] Export processing < 10 seconds
- [ ] API response time < 500ms
- [ ] Mobile performance optimized
- [ ] HTTPS/TLS enabled
- [ ] Authentication implemented
- [ ] Session management
- [ ] Input validation
- [ ] Rate limiting

### 11.3 Business Requirements

- [ ] Fare calculations match formula
- [ ] Historical data imported correctly
- [ ] Expense tracking accurate
- [ ] Report metrics validated
- [ ] Intuitive interface
- [ ] Clear pricing display
- [ ] Easy trip logging
- [ ] Accessible from mobile
- [ ] Fast response times

---

## 12. IMPLEMENTATION TIMELINE

### Phase 1: Architecture & Setup (Week 1-2)
- Create Next.js 14 project with TypeScript
- Set up Supabase project and PostgreSQL database
- Create all database tables and relationships
- Implement Supabase Auth (email/password)
- Configure Google Maps API credentials
- Set up environment variables (.env.local)
- Deploy skeleton app to Vercel
- Set up GitHub Actions for deployment

### Phase 2: Public Fare Calculator (Week 3-4)
- Build calculator UI layout
- Integrate Google Maps Places API
- Integrate Google Maps Distance Matrix API
- Implement fare calculation logic
- Add trip type toggle (one-way / round-trip)
- Add transportation mode option (private / public)
- Add additional fees checkboxes
- Add optional contact form
- Test on mobile/tablet/desktop
- Deploy to production

### Phase 3: Admin Dashboard - Core (Week 5-6)
- Build admin login page
- Create dashboard layout/navigation
- Implement dashboard overview cards
- Build trip form with Google Maps autocomplete
- Create trip list with filtering/sorting
- Implement fare calculation on trip creation
- Build expense form
- Create expense list with filtering
- Add edit/delete functionality
- Test all CRUD operations

### Phase 4: Vehicles & Drivers (Week 7-8)
- Build vehicle add/edit forms
- Create vehicle list view
- Implement vehicle analytics calculations
- Build driver add/edit forms
- Create driver list view
- Implement driver compensation tracking
- Create monthly payroll report
- Add overtime logging
- Test all functionality

### Phase 5: Reporting & Export (Week 9-10)
- Build report generation queries
- Create revenue report
- Create expense report
- Create profitability analysis
- Create payroll report
- Calculate KPIs: cost/km, margin%, utilization
- Implement Excel export
- Implement Google Sheets export
- Create report filters
- Test all report types

### Phase 6: Data Import (Week 11)
- Build import form
- Implement CSV parsing
- Create data validation logic
- Handle duplicates
- Map service types
- Batch insert records
- Create import report
- Test with sample data

### Phase 7: Testing & Polish (Week 12)
- Functional testing across all features
- Performance testing and optimization
- Security testing (pen test basics)
- Mobile responsiveness testing
- Browser compatibility testing
- User acceptance testing with Alan
- Documentation/user guide
- Training for Alan

### Timeline Summary

```
Week 1-2:  Architecture & Setup
Week 3-4:  Public Fare Calculator
Week 5-6:  Admin Dashboard Core
Week 7-8:  Vehicles & Drivers
Week 9-10: Reporting & Export
Week 11:   Data Import
Week 12:   Testing & Polish
─────────────────────────────
Total:     12 weeks (~3 months)
```

**Alternative Fast Track:** 8 weeks (reduced features in initial release)

---

## APPENDICES

### Appendix A: Service Types
1. **Cita Medica** - Medical appointments
2. **Post Cirugia** - Post-surgical transportation
3. **Pre Cirugia** - Pre-surgical transportation
4. **Aeropuerto** - Airport transportation
5. **Terapia** - Therapy sessions
6. **Eventos** - Events transportation
7. **Recreativa** - Recreational activities
8. **Subir/Bajar** - Pickup/dropoff services

### Appendix B: Expense Categories
1. **Gas** - Fuel purchases (tracked with km/liter)
2. **Maintenance** - Regular vehicle maintenance
3. **Insurance** - Vehicle insurance
4. **Vehicle Registration** - Annual registration/permits
5. **Tolls** - Road tolls and highway fees
6. **Repairs** - Vehicle repairs (non-maintenance)

### Appendix C: Glossary
- **DOP:** Dominican Peso (currency)
- **GMT-4:** Dominican Republic timezone
- **Round-trip:** Pickup → Destination → Pickup
- **One-way:** Pickup → Destination (no return)
- **Meditiko:** Electric vehicle, available for public mode
- **Fare:** Total trip cost in DOP
- **KPI:** Key Performance Indicator
- **RLS:** Row-Level Security (database)
- **JWT:** JSON Web Token (authentication)

### Appendix D: Dependencies

```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "@supabase/supabase-js": "^2.39.0",
  "@googlemaps/js-api-loader": "^1.16.2",
  "tailwindcss": "^3.3.0",
  "react-hook-form": "^7.45.0",
  "xlsx": "^0.18.5",
  "chart.js": "^4.3.0",
  "date-fns": "^2.30.0"
}
```

---

## DOCUMENT HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-18 | Initial PRD created |

---

**END OF DOCUMENT**
