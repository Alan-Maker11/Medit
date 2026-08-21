-- Manual Uber side-earnings tracking per driver (e.g. Franklin's Uber trips, which
-- Medit doesn't track directly). Admin enters that day's total Uber earnings (all trips
-- combined) and the driver's 20% commission is computed automatically and added on top
-- of that driver's Medit salary on the Salary page.
-- Run this in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS driver_uber_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  gross_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0, -- driver's 20% commission, computed from gross_amount
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (driver_id, date)
);

-- If the table already exists from an earlier run, add the new column.
ALTER TABLE driver_uber_earnings ADD COLUMN IF NOT EXISTS gross_amount NUMERIC(12, 2) NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_driver_uber_earnings_driver ON driver_uber_earnings(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_uber_earnings_date ON driver_uber_earnings(date);

ALTER TABLE driver_uber_earnings ENABLE ROW LEVEL SECURITY;

-- Same access model as overtime_entries: any authenticated staff session can manage it.
-- Driver-facing accounts never call this table (no UI path does), same as overtime_entries.
DROP POLICY IF EXISTS "Authenticated users can manage driver_uber_earnings" ON driver_uber_earnings;
CREATE POLICY "Authenticated users can manage driver_uber_earnings" ON driver_uber_earnings
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
