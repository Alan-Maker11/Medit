-- Records a driver handing cash they've collected over to the admin, and what it was used for.
-- This is distinct from a direct cash expense (driver spends the cash themselves, e.g. buying
-- gas without routing it through the admin) — that already decrements driver cash-in-hand via
-- expenses.driver_id + withdrawal_account = 'Cash on hand'. A handoff decrements it the moment
-- the cash changes hands, regardless of what it's later used for.
create table if not exists driver_cash_handoffs (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references drivers(id) on delete cascade,
  date date not null default current_date,
  amount numeric(12, 2) not null check (amount > 0),
  used_for varchar(20) not null check (used_for in ('gas', 'salary', 'bank_deposit', 'other')),
  bank_account varchar(30) check (bank_account in ('Banreservas - 7314', 'Popular - 4389', 'BHD - 0021')),
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists idx_driver_cash_handoffs_driver on driver_cash_handoffs(driver_id);
create index if not exists idx_driver_cash_handoffs_date on driver_cash_handoffs(date);

alter table driver_cash_handoffs enable row level security;
drop policy if exists "Authenticated users can manage driver_cash_handoffs" on driver_cash_handoffs;
create policy "Authenticated users can manage driver_cash_handoffs" on driver_cash_handoffs
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
