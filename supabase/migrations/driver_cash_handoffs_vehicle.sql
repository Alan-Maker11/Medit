-- Lets a cash handoff record which vehicle it was spent on (gas, toll, maintenance), so these
-- show up with the same detail as a regular vehicle expense when reviewed on the dashboard.
alter table driver_cash_handoffs add column if not exists vehicle_id uuid references vehicles(id);

alter table driver_cash_handoffs drop constraint if exists driver_cash_handoffs_used_for_check;
alter table driver_cash_handoffs add constraint driver_cash_handoffs_used_for_check
  check (used_for in ('gas', 'toll', 'maintenance', 'salary', 'bank_deposit', 'other'));
