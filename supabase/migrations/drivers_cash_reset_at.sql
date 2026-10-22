-- Lets the admin "start fresh" on a driver's cash-in-hand tracking: once set, the dashboard's
-- cash-in-hand calculation ignores any trip/expense/handoff dated before this date for that
-- driver, so historical noise doesn't need to be reconciled transaction-by-transaction — just
-- set the reset date and start recording handoffs going forward.
alter table drivers add column if not exists cash_reset_at date;
