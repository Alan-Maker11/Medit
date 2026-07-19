-- Persist wheelchair / stair-climber equipment needs on trips so the driver portal
-- can show "what to bring" without exposing any pricing (these were previously
-- only used to compute additional_fees at creation time and were never stored).
alter table trips add column if not exists needs_wheelchair boolean not null default false;
alter table trips add column if not exists needs_stair_climber boolean not null default false;
