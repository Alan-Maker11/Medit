-- Driver Portal — Phase 1
-- Run this in the Supabase SQL Editor. Only creates what Phase 1 actually uses
-- (login + calendar + trip details). Notifications/timesheet are deferred to a later phase.

CREATE TABLE IF NOT EXISTS driver_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_id UUID UNIQUE REFERENCES drivers(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE driver_accounts ENABLE ROW LEVEL SECURITY;

-- A driver can see only their own account row
CREATE POLICY "drivers_can_view_own_account"
  ON driver_accounts FOR SELECT
  USING (auth.uid() = user_id);

-- A logged-in driver can read their own trips (in addition to whatever staff/admin access already exists)
CREATE POLICY "drivers_can_view_own_trips"
  ON trips FOR SELECT
  USING (
    driver_id = (SELECT driver_id FROM driver_accounts WHERE user_id = auth.uid())
  );

-- A logged-in driver can read service names (needed to display trip details)
CREATE POLICY "drivers_can_view_services"
  ON services FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM driver_accounts WHERE user_id = auth.uid())
  );

-- To create a driver login:
-- 1. In Supabase Dashboard -> Authentication -> Users -> Add User (set email + password)
-- 2. Then run:
--    INSERT INTO driver_accounts (user_id, driver_id)
--    VALUES ('<the new auth user id>', '<the matching row id from the drivers table>');
