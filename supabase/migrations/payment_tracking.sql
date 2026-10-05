-- Payment tracking: which account/method a trip's advance & final payment came through,
-- and which account an expense was withdrawn from. Run this in the Supabase SQL Editor.

alter table trips add column if not exists advance_payment_amount numeric(12, 2);
alter table trips add column if not exists advance_payment_method varchar(30)
  check (advance_payment_method in ('Banreservas - 7314', 'Popular - 4389', 'BHD - 0021', 'Cash', 'Check'));
alter table trips add column if not exists advance_payment_status varchar(20) default 'pending'
  check (advance_payment_status in ('pending', 'received'));
alter table trips add column if not exists advance_payment_date date;

alter table trips add column if not exists final_payment_amount numeric(12, 2);
alter table trips add column if not exists final_payment_method varchar(30)
  check (final_payment_method in ('Banreservas - 7314', 'Popular - 4389', 'BHD - 0021', 'Cash', 'Check'));
alter table trips add column if not exists final_payment_status varchar(20) default 'pending'
  check (final_payment_status in ('pending', 'received', 'collected'));
alter table trips add column if not exists final_payment_date date;

alter table expenses add column if not exists withdrawal_account varchar(30)
  check (withdrawal_account in ('Banreservas - 7314', 'Popular - 4389', 'BHD - 0021', 'Cash on hand', 'Check'));
alter table expenses add column if not exists withdrawal_method varchar(20)
  check (withdrawal_method in ('ATM', 'Transfer', 'Cash payment', 'Direct deposit', 'Check'));
