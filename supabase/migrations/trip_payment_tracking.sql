-- Payment status tracking per trip (who's paid, who owes, full vs weekly payers).
-- Run this in the Supabase SQL Editor.

ALTER TABLE trips ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) NOT NULL DEFAULT 'pending'
  CHECK (payment_status IN ('pending', 'partial', 'paid'));
ALTER TABLE trips ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) NOT NULL DEFAULT 'full'
  CHECK (payment_method IN ('full', 'weekly'));
ALTER TABLE trips ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS payment_date DATE;

CREATE INDEX IF NOT EXISTS idx_trips_payment_status ON trips(payment_status);

CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(20),
  payment_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_history_trip ON payment_history(trip_id);

ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Same access model as the rest of the app's operational tables.
DROP POLICY IF EXISTS "Authenticated users can manage payment_history" ON payment_history;
CREATE POLICY "Authenticated users can manage payment_history" ON payment_history
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
