-- Web Push subscriptions for drivers (installed as a home-screen PWA).
-- One driver can have multiple subscriptions (one per device/browser).
create table if not exists driver_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references drivers(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_driver_push_subscriptions_driver on driver_push_subscriptions(driver_id);

alter table driver_push_subscriptions enable row level security;

drop policy if exists "Authenticated users can manage driver_push_subscriptions" on driver_push_subscriptions;
create policy "Authenticated users can manage driver_push_subscriptions" on driver_push_subscriptions
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
