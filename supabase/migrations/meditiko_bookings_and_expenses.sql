-- Meditiko Express: booking requests submitted from the public calculator
-- (app/meditiko/calculator), plus a separate expenses table for the Meditiko fleet.
-- Run this in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS meditiko_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_name VARCHAR(255) NOT NULL,
  passenger_phone VARCHAR(50) NOT NULL,
  pickup_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  trip_distance_km NUMERIC(10, 2) NOT NULL,
  estimated_duration_minutes INT NOT NULL DEFAULT 0,
  trip_type VARCHAR(20) NOT NULL DEFAULT 'one_way' CHECK (trip_type IN ('one_way', 'round_trip')),
  waiting_hours NUMERIC(5, 2) NOT NULL DEFAULT 0,
  estimated_price NUMERIC(10, 2) NOT NULL,
  assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meditiko_bookings_created ON meditiko_bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_meditiko_bookings_status ON meditiko_bookings(status);
CREATE INDEX IF NOT EXISTS idx_meditiko_bookings_driver ON meditiko_bookings(assigned_driver_id);

ALTER TABLE meditiko_bookings ENABLE ROW LEVEL SECURITY;

-- The calculator page has no login — anyone (including anonymous visitors) must be
-- able to submit a booking request. Reading/managing bookings stays staff-only.
DROP POLICY IF EXISTS "Anyone can create a meditiko booking" ON meditiko_bookings;
CREATE POLICY "Anyone can create a meditiko booking" ON meditiko_bookings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can manage meditiko bookings" ON meditiko_bookings;
CREATE POLICY "Staff can manage meditiko bookings" ON meditiko_bookings
  FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Staff can update meditiko bookings" ON meditiko_bookings;
CREATE POLICY "Staff can update meditiko bookings" ON meditiko_bookings
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Staff can delete meditiko bookings" ON meditiko_bookings;
CREATE POLICY "Staff can delete meditiko bookings" ON meditiko_bookings
  FOR DELETE USING (auth.role() = 'authenticated');

-- Meditiko fleet expenses — separate from the regular vehicles/expenses table.
CREATE TABLE IF NOT EXISTS meditiko_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meditiko_expenses_date ON meditiko_expenses(date);
CREATE INDEX IF NOT EXISTS idx_meditiko_expenses_category ON meditiko_expenses(category);

ALTER TABLE meditiko_expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can manage meditiko_expenses" ON meditiko_expenses;
CREATE POLICY "Authenticated users can manage meditiko_expenses" ON meditiko_expenses
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
