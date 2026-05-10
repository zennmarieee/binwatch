"use client";

import { useEffect, useState } from "react";

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
      emoji: "🚨",
      color: "bg-red-50 border-red-100",
    },
    {
      key: "points_almost_full" as keyof Settings,
      label: "Almost Full",
      description: "Bin is getting full",
      emoji: "⚠️",
      color: "bg-orange-50 border-orange-100",
    },
    {
      key: "points_damaged" as keyof Settings,
      label: "Damaged",
      description: "Bin is broken or damaged",
      emoji: "🔧",
      color: "bg-yellow-50 border-yellow-100",
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
          className={`flex items-center justify-between rounded-2xl border p-4 ${field.color}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{field.emoji}</span>
            <div>
              <p className="font-bold text-[#191c1d]">{field.label}</p>
              <p className="text-xs text-[#4c616c]">{field.description}</p>
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
              className="w-20 rounded-xl border border-black/10 px-3 py-2 text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-700/20"
            />
            <span className="text-xs font-bold text-[#4c616c]">pts</span>
          </div>
        </div>
      ))}

      {/* Error */}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {/* Success */}
      {success && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          ✓ Settings saved successfully.
        </p>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving || !hasChanges}
        className="rounded-xl bg-[#176d25] px-6 py-3 font-bold text-white transition-colors hover:bg-[#12581e] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : hasChanges ? "Save Settings" : "No Changes"}
      </button>

    </div>
  );
}