import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCsv } from "@/lib/csv";
import { SERVICE_TYPES } from "@/lib/types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function getField(row: Record<string, string>, names: string[]): string | undefined {
  for (const name of names) {
    const value = row[name.toLowerCase()];
    if (value !== undefined && value !== "") return value;
  }
  return undefined;
}

function parsePrice(raw: string | undefined): number {
  if (!raw) return NaN;
  return Number(raw.replace(/[^0-9.-]/g, ""));
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "A CSV file is required" }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCsv(text);

  const { data: services } = await supabase.from("services").select("id, name");
  const serviceByName = new Map((services ?? []).map((s) => [s.name.toLowerCase(), s.id]));

  const { data: existingTrips } = await supabase.from("trips").select("date, total_fare, client_name");
  const existingKeys = new Set(
    (existingTrips ?? []).map((t) => `${t.date}|${t.total_fare}|${(t.client_name ?? "").toLowerCase()}`)
  );

  const errors: string[] = [];
  const toInsert: Record<string, unknown>[] = [];
  let skipped = 0;

  rows.forEach((row, index) => {
    const rowNum = index + 2; // account for header row
    const date = getField(row, ["date"]);
    const rawPrice = getField(row, ["price"]);
    const serviceType = getField(row, ["service_type", "type of transportation"]);
    const clientName = getField(row, ["client_name", "customer name"]) ?? "";

    if (!date || !DATE_RE.test(date)) {
      errors.push(`Row ${rowNum}: invalid date "${date}"`);
      return;
    }
    if (!rawPrice && !serviceType) {
      // No trip recorded for this day (day off, holiday, blank placeholder row)
      skipped++;
      return;
    }
    const price = parsePrice(rawPrice);
    if (Number.isNaN(price)) {
      errors.push(`Row ${rowNum}: invalid price "${getField(row, ["price"])}"`);
      return;
    }
    if (!serviceType || !SERVICE_TYPES.some((s) => s.toLowerCase() === serviceType.toLowerCase())) {
      errors.push(`Row ${rowNum}: unknown service_type "${serviceType}"`);
      return;
    }

    const key = `${date}|${price}|${clientName.toLowerCase()}`;
    if (existingKeys.has(key)) {
      skipped++;
      return;
    }
    existingKeys.add(key);

    toInsert.push({
      date,
      time: "12:00:00",
      service_id: serviceByName.get(serviceType.toLowerCase()) ?? null,
      client_name: clientName,
      pickup_address: row.notes || "Imported record",
      destination_address: row.notes || "Imported record",
      trip_type: "one-way",
      transportation_mode: "private",
      base_fare: price,
      distance_cost: 0,
      duration_cost: 0,
      waiting_cost: 0,
      additional_fees: 0,
      total_fare: price,
      status: "completed",
      notes: row.notes || null,
    });
  });

  let imported = 0;
  if (toInsert.length > 0) {
    const { error } = await supabase.from("trips").insert(toInsert);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    imported = toInsert.length;
  }

  const { data: log } = await supabase
    .from("import_logs")
    .insert({
      file_name: file.name,
      total_records: rows.length,
      imported_records: imported,
      skipped_records: skipped,
      error_records: errors.length,
      import_data: { errors },
      status: "completed",
    })
    .select()
    .single();

  return NextResponse.json({
    total_records: rows.length,
    imported,
    skipped,
    errors,
    import_id: log?.id,
  });
}
