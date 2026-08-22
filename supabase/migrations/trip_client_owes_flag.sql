-- Revert of the payment_status/payment_method/paid_amount system — replaced with a
-- single manual reminder flag. This has nothing to do with trip completion status
-- ("Estado" / pending-completed-cancelled) — that column is untouched.
-- Run this in the Supabase SQL Editor.

DROP TABLE IF EXISTS payment_history;

ALTER TABLE trips DROP COLUMN IF EXISTS payment_status;
ALTER TABLE trips DROP COLUMN IF EXISTS payment_method;
ALTER TABLE trips DROP COLUMN IF EXISTS paid_amount;
ALTER TABLE trips DROP COLUMN IF EXISTS payment_date;

-- Simple manual reminder: "this client still owes for this trip." Off by default —
-- nothing is flagged unless you click it on. Purely a note to self, not a workflow state.
ALTER TABLE trips ADD COLUMN IF NOT EXISTS client_owes BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_trips_client_owes ON trips(client_owes);
