-- Allow a driver to update the status of trips assigned to them (used by the
-- "Mark as Completed" button in the driver portal). The API route restricts
-- the update to the `status` column only; this policy restricts it to rows
-- that actually belong to the calling driver.
CREATE POLICY "drivers_can_update_own_trip_status"
  ON trips FOR UPDATE
  USING (
    driver_id = (SELECT driver_id FROM driver_accounts WHERE user_id = auth.uid())
  )
  WITH CHECK (
    driver_id = (SELECT driver_id FROM driver_accounts WHERE user_id = auth.uid())
  );
