-- Supports round-trip jobs where the driver drops the client off now and comes back hours
-- later (e.g. Subir/Bajar: take the client down, then bring them back up after an appointment),
-- instead of an immediate there-and-back trip. return_time records when the driver is expected
-- back; down_completed_at/up_completed_at track each leg separately so the driver can't
-- accidentally mark the whole job "completed" after just the first leg.
alter table trips add column if not exists return_time time;
alter table trips add column if not exists down_completed_at timestamptz;
alter table trips add column if not exists up_completed_at timestamptz;
