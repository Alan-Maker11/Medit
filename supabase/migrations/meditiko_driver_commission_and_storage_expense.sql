-- Meditiko drivers have a completely different pay structure from regular drivers:
-- a fixed base salary + 20% commission per contracted client's daily trip total
-- (same mechanic as the existing Uber commission tracking, but per-client).
-- Run this in the Supabase SQL Editor.

ALTER TABLE drivers ADD COLUMN IF NOT EXISTS is_meditiko BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS meditiko_driver_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  client_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  gross_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0, -- driver's 20% commission, computed from gross_amount
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (driver_id, client_name, date)
);

CREATE INDEX IF NOT EXISTS idx_meditiko_driver_earnings_driver ON meditiko_driver_earnings(driver_id);
CREATE INDEX IF NOT EXISTS idx_meditiko_driver_earnings_date ON meditiko_driver_earnings(date);

ALTER TABLE meditiko_driver_earnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can manage meditiko_driver_earnings" ON meditiko_driver_earnings;
CREATE POLICY "Authenticated users can manage meditiko_driver_earnings" ON meditiko_driver_earnings
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
