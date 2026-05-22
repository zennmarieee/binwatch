"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Award, Save, Wrench } from "lucide-react";

interface Settings {
  points_overflowing: string;
  points_almost_full: string;
  points_damaged: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    points_overflowing: "50",
    points_almost_full: "30",
    points_damaged: "40",
  });
  const [originalSettings, setOriginalSettings] = useState<Settings>({
    points_overflowing: "50",
    points_almost_full: "30",
    points_damaged: "40",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      const fetched = {
        points_overflowing: data.points_overflowing ?? "50",
        points_almost_full: data.points_almost_full ?? "30",
        points_damaged: data.points_damaged ?? "40",
      };
      setSettings(fetched);
      setOriginalSettings(fetched);
      setLoading(false);
    }

    fetchSettings();
  }, []);

  const hasChanges =
    settings.points_overflowing !== originalSettings.points_overflowing ||
    settings.points_almost_full !== originalSettings.points_almost_full ||
    settings.points_damaged !== originalSettings.points_damaged;

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);

    const values = Object.values(settings).map(Number);
    if (values.some((v) => isNaN(v) || v < 0)) {
      setError("All point values must be valid positive numbers.");
      setSaving(false);
      return;
    }

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to save settings.");
      setSaving(false);
      return;
    }

    setOriginalSettings(settings);
    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  }

  const pointFields = [
    {
      key: "points_overflowing" as keyof Settings,
      label: "Overflowing",
      description: "Bin is full and spilling over",
      icon: AlertTriangle,
      tone: "border-rose-200 bg-rose-50/70 text-rose-700",
    },
    {
      key: "points_almost_full" as keyof Settings,
      label: "Almost Full",
      description: "Bin is getting full",
      icon: Award,
      tone: "border-amber-200 bg-amber-50/70 text-amber-700",
    },
    {
      key: "points_damaged" as keyof Settings,
      label: "Damaged",
      description: "Bin is broken or damaged",
      icon: Wrench,
      tone: "border-sky-200 bg-sky-50/70 text-sky-700",
    },
  ];

  if (loading) {
    return (
      <div className="mt-6 space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 w-full animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Point Fields */}
      {pointFields.map((field) => (
        <div
          key={field.key}
          className={`flex items-center justify-between rounded-2xl border p-4 shadow-sm ${field.tone}`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 shadow-sm">
              <field.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-slate-900">{field.label}</p>
              <p className="text-xs text-slate-500">{field.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={settings[field.key]}
              onChange={(e) =>
                setSettings({ ...settings, [field.key]: e.target.value })
              }
              className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              pts
            </span>
          </div>
        </div>
      ))}

      {/* Error */}
      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}

      {/* Success */}
      {success && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Settings saved successfully.
        </p>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving || !hasChanges}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : hasChanges ? "Save Settings" : "No Changes"}
      </button>
    </div>
  );
}
