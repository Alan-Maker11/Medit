-- Cash expenses need to be attributed to the driver whose cash-in-hand paid for them,
-- so the dashboard can show a running cash balance per driver. Run in the Supabase SQL Editor.

alter table expenses add column if not exists driver_id uuid references drivers(id) on delete set null;
create index if not exists idx_expenses_driver on expenses(driver_id);
