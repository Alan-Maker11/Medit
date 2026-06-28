-- Medit Operations Management System
-- Database schema for Supabase (PostgreSQL)

create extension if not exists "pgcrypto";

-- services table (8 service types)
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null unique,
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- vehicles table
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  type varchar(100),
  license_plate varchar(20) unique,
  fuel_consumption numeric(10, 2),
  current_km numeric(12, 2),
  status varchar(50) default 'active' check (status in ('active', 'inactive', 'maintenance')),
  purchase_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- drivers table
create table if not exists drivers (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  phone varchar(20),
  email varchar(255),
  base_monthly_salary numeric(12, 2),
  overtime_hourly_rate numeric(10, 2),
  diet_morning_allowance numeric(10, 2) default 100,
  diet_evening_allowance numeric(10, 2) default 200,
  status varchar(50) default 'active' check (status in ('active', 'inactive')),
  start_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- driver_vehicles (many-to-many)
create table if not exists driver_vehicles (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references drivers(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  assigned_date date default current_date,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- trips table
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  time time not null default current_time,
  service_id uuid references services(id),
  client_name varchar(255),
  client_phone varchar(20),
  pickup_address text not null,
  pickup_lat numeric(10, 8),
  pickup_lng numeric(11, 8),
  destination_address text not null,
  destination_lat numeric(10, 8),
  destination_lng numeric(11, 8),
  driver_id uuid references drivers(id),
  vehicle_id uuid references vehicles(id),
  distance_km numeric(10, 2),
  duration_minutes integer,
  trip_type varchar(50) check (trip_type in ('one-way', 'round-trip')),
  transportation_mode varchar(50) default 'private' check (transportation_mode in ('private', 'public')),
  waiting_hours numeric(10, 2) default 0,
  base_fare numeric(12, 2) default 1250,
  distance_cost numeric(12, 2),
  duration_cost numeric(12, 2),
  waiting_cost numeric(12, 2) default 0,
  additional_fees numeric(12, 2) default 0,
  total_fare numeric(12, 2),
  status varchar(50) default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- expenses table
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  category varchar(100) not null check (category in ('gas', 'maintenance', 'insurance', 'registration', 'tolls', 'repairs')),
  vehicle_id uuid references vehicles(id),
  amount numeric(12, 2) not null,
  km_at_fill numeric(12, 2),
  description text,
  receipt_url varchar(500),
  status varchar(50) default 'recorded' check (status in ('recorded', 'verified')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- driver_compensation table (payroll tracking)
create table if not exists driver_compensation (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references drivers(id) on delete cascade,
  month date not null,
  base_salary numeric(12, 2),
  overtime_hours numeric(10, 2) default 0,
  overtime_pay numeric(12, 2) default 0,
  diet_allowance_morning_count integer default 0,
  diet_allowance_evening_count integer default 0,
  diet_allowance_total numeric(12, 2) default 0,
  total_compensation numeric(12, 2),
  paid_status varchar(50) default 'pending' check (paid_status in ('pending', 'paid')),
  payment_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (driver_id, month)
);

-- overtime_entries table (per-day overtime/diet log feeding driver_compensation)
create table if not exists overtime_entries (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references drivers(id) on delete cascade,
  date date not null,
  hours numeric(10, 2) default 0,
  dieta_amount numeric(12, 2) default 0,
  notes text,
  created_at timestamptz default now()
);

-- reports table (cache weekly reports)
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  report_type varchar(50),
  period_start date,
  period_end date,
  report_data jsonb,
  generated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- import_logs table (track data imports)
create table if not exists import_logs (
  id uuid primary key default gen_random_uuid(),
  file_name varchar(255),
  total_records integer,
  imported_records integer,
  skipped_records integer,
  error_records integer,
  import_data jsonb,
  status varchar(50) check (status in ('in_progress', 'completed', 'failed')),
  created_at timestamptz default now()
);

-- Seed the 8 service types
insert into services (name, description) values
  ('Cita Medica', 'Medical appointment transportation'),
  ('Post Cirugia', 'Post-surgical transportation'),
  ('Pre Cirugia', 'Pre-surgical transportation'),
  ('Aeropuerto', 'Airport transportation'),
  ('Terapia', 'Therapy session transportation'),
  ('Eventos', 'Events transportation'),
  ('Recreativa', 'Recreational activity transportation'),
  ('Subir/Bajar', 'Pickup/dropoff service')
on conflict (name) do nothing;

-- Migration: add km_at_fill to expenses for existing databases
alter table expenses add column if not exists km_at_fill numeric(12, 2);

-- Migration: create overtime_entries for existing databases
create table if not exists overtime_entries (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references drivers(id) on delete cascade,
  date date not null,
  hours numeric(10, 2) default 0,
  dieta_amount numeric(12, 2) default 0,
  notes text,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_trips_date on trips(date);
create index if not exists idx_trips_driver on trips(driver_id);
create index if not exists idx_trips_vehicle on trips(vehicle_id);
create index if not exists idx_trips_status on trips(status);
create index if not exists idx_expenses_date on expenses(date);
create index if not exists idx_expenses_vehicle on expenses(vehicle_id);
create index if not exists idx_expenses_category on expenses(category);

-- Row Level Security: restrict all tables to authenticated users
alter table services enable row level security;
alter table vehicles enable row level security;
alter table drivers enable row level security;
alter table driver_vehicles enable row level security;
alter table trips enable row level security;
alter table expenses enable row level security;
alter table driver_compensation enable row level security;
alter table reports enable row level security;
alter table import_logs enable row level security;
alter table overtime_entries enable row level security;

create policy "Authenticated users can manage services" on services
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Public can read active services" on services
  for select using (is_active = true);

create policy "Authenticated users can manage vehicles" on vehicles
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated users can manage drivers" on drivers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated users can manage driver_vehicles" on driver_vehicles
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated users can manage trips" on trips
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated users can manage expenses" on expenses
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated users can manage driver_compensation" on driver_compensation
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated users can manage reports" on reports
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated users can manage import_logs" on import_logs
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Authenticated users can manage overtime_entries" on overtime_entries
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
