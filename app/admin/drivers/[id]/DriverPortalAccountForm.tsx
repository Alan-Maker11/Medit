"use client";

import { useEffect, useState } from "react";

export default function DriverPortalAccountForm({ driverId }: { driverId: string }) {
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/drivers/${driverId}/portal-account`)
      .then((res) => res.json())
      .then((data) => setHasAccount(Boolean(data.hasAccount)))
      .catch(() => setHasAccount(false));
  }, [driverId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    const res = await fetch(`/api/drivers/${driverId}/portal-account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to create login");
      return;
    }
    setSuccess("Driver portal login created.");
    setHasAccount(true);
    setEmail("");
    setPassword("");
  }

  async function handleRevoke() {
    if (!window.confirm("Revoke this driver's portal login? They will no longer be able to sign in.")) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/drivers/${driverId}/portal-account`, { method: "DELETE" });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to revoke login");
      return;
    }
    setHasAccount(false);
    setSuccess("Portal login revoked.");
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-lg font-semibold">Driver Portal Access</h2>

      {hasAccount === null && <p className="text-sm text-zinc-500">Checking...</p>}

      {hasAccount === true && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This driver has an active portal login and can access <code>/driver/login</code>.
          </p>
          <button
            onClick={handleRevoke}
            disabled={submitting}
            className="self-start rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            Revoke portal access
          </button>
        </div>
      )}

      {hasAccount === false && (
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This driver has no portal login yet. Create one so they can view their schedule at <code>/driver/login</code>.
          </p>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="At least 6 characters"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="self-start rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-transform duration-150 ease-out hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create driver login"}
          </button>
        </form>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-3 text-sm text-green-600">{success}</p>}
    </div>
  );
}
