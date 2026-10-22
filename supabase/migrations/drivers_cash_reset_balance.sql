-- Pairs with drivers.cash_reset_at: the known-correct cash-in-hand balance at the moment of the
-- reset, so "start fresh" doesn't have to mean "start at zero" — the dashboard adds this on top
-- of whatever's collected/spent/handed off since cash_reset_at.
alter table drivers add column if not exists cash_reset_balance numeric(12, 2) not null default 0;
