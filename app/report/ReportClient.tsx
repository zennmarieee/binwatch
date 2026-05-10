"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bin } from "@/lib/bins";

interface Report {
  id: string;
  status: string;
  condition: string;
  created_at: string;
}

interface Props {
  bin: Bin;
  activeReport: Report | null;
}

const CONDITIONS = [
  {
    value: "overflowing",
    label: "Overflowing",
    description: "Trash is spilling out",
    emoji: "🚨",
  },
  {
    value: "almost_full",
    label: "Almost Full",
    description: "Getting full, needs attention soon",
    emoji: "⚠️",
  },
  {
    value: "damaged",
    label: "Damaged",
    description: "Bin is broken or damaged",
    emoji: "🔧",
  },
];

export default function ReportClient({ bin, activeReport }: Props) {
  const supabase = createClient();

  const [condition, setCondition] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pointsEarned, setPointsEarned] = useState(0);

  // Bin is already reported
  if (activeReport) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7faf7] px-4">
        <div className="w-full max-w-sm rounded-3xl border border-black/5 bg-white p-8 text-center shadow-lg">
          <p className="text-4xl">
            {activeReport.status === "pending" ? "📋" : "🔧"}
          </p>
          <h1 className="mt-4 text-xl font-extrabold text-[#102013]">
            Already Reported
          </h1>
          <p className="mt-2 text-sm text-[#4c616c]">
            {activeReport.status === "pending"
              ? "This bin has been reported and is awaiting staff."
              : "Staff is currently handling this bin."}
          </p>
          <div className="mt-4 rounded-2xl bg-[#f3f6f3] px-4 py-3 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4c616c]">
              Bin
            </p>
            <p className="mt-1 font-bold text-[#191c1d]">{bin.name}</p>
            <p className="text-sm text-[#4c616c]">{bin.location_name}</p>
          </div>
          <a
            href="/"
            className="mt-6 inline-block rounded-xl border border-[#176d25] px-6 py-3 font-bold text-[#176d25]"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // Bin is in cooldown (recently resolved, cooldown not yet passed)
  if (bin.status === "resolved") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7faf7] px-4">
        <div className="w-full max-w-sm rounded-3xl border border-black/5 bg-white p-8 text-center shadow-lg">
          <p className="text-4xl">✅</p>
          <h1 className="mt-4 text-xl font-extrabold text-[#102013]">
            Recently Resolved
          </h1>
          <p className="mt-2 text-sm text-[#4c616c]">
            This bin was recently serviced by our maintenance staff. Reporting
            will be available again shortly.
          </p>
          <div className="mt-4 rounded-2xl bg-[#f3f6f3] px-4 py-3 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4c616c]">
              Bin
            </p>
            <p className="mt-1 font-bold text-[#191c1d]">{bin.name}</p>
            <p className="text-sm text-[#4c616c]">{bin.location_name}</p>
          </div>
          <a
            href="/"
            className="mt-6 inline-block rounded-xl border border-[#176d25] px-6 py-3 font-bold text-[#176d25]"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // Submitted successfully
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7faf7] px-4">
        <div className="w-full max-w-sm rounded-3xl border border-black/5 bg-white p-8 text-center shadow-lg">
          <p className="text-4xl">✅</p>
          <h1 className="mt-4 text-xl font-extrabold text-[#102013]">
            Report Submitted!
          </h1>
          <p className="mt-2 text-sm text-[#4c616c]">
            Thank you for helping keep campus clean. Staff has been notified.
          </p>

          {pointsEarned > 0 && (
            <div className="mt-4 rounded-2xl bg-green-50 px-4 py-3">
              <p className="font-bold text-green-700">
                +{pointsEarned} points earned!
              </p>
              <p className="text-sm text-green-600">
                Check your points at the lookup page.
              </p>
            </div>
          )}

          <div className="mt-4 rounded-2xl bg-[#f3f6f3] px-4 py-3 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4c616c]">
              Bin
            </p>
            <p className="mt-1 font-bold text-[#191c1d]">{bin.name}</p>
            <p className="text-sm text-[#4c616c]">{bin.location_name}</p>
          </div>

          <a
            href="/"
            className="mt-6 inline-block rounded-xl bg-[#176d25] px-6 py-3 font-bold text-white"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  async function handleSubmit() {
    setError("");

    if (!condition) {
      setError("Please select a bin condition.");
      return;
    }

    setLoading(true);

    // Submit report
    const { error: reportError } = await supabase.from("reports").insert({
      bin_id: bin.id,
      condition,
      student_id: studentId.trim() || null,
      status: "pending",
    });

    if (reportError) {
      setError("Failed to submit report. Please try again.");
      setLoading(false);
      return;
    }

    // Update bin status to pending
    // Update bin status to pending and clear resolved_at
    await supabase
      .from("bins")
      .update({
        status: "pending",
        resolved_at: null, // ← clear this so cooldown resets
      })
      .eq("id", bin.id);

    // Award points if student ID provided
    if (studentId.trim()) {
      // Fetch points value for this condition from settings
      const settingsRes = await fetch("/api/admin/settings");
      const settingsData = await settingsRes.json();

      const pointsMap: Record<string, number> = {
        overflowing: parseInt(settingsData.points_overflowing ?? "50"),
        almost_full: parseInt(settingsData.points_almost_full ?? "30"),
        damaged: parseInt(settingsData.points_damaged ?? "40"),
      };

      const points = pointsMap[condition] ?? 50;

      const { data: existing } = await supabase
        .from("student_points")
        .select("*")
        .eq("student_id", studentId.trim())
        .single();

      if (existing) {
        await supabase
          .from("student_points")
          .update({
            total_points: existing.total_points + points,
            report_count: existing.report_count + 1,
            last_activity: new Date().toISOString(),
          })
          .eq("student_id", studentId.trim());
      } else {
        await supabase.from("student_points").insert({
          student_id: studentId.trim(),
          total_points: points,
          report_count: 1,
          last_activity: new Date().toISOString(),
        });
      }

      setPointsEarned(points);
    }

    // Log activity
    await supabase.from("activity_logs").insert({
      bin_id: bin.id,
      action: "report_submitted",
      notes: `Condition: ${condition}${studentId ? ` | Student: ${studentId}` : ""}`,
    });

    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7faf7] px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="text-4xl">🗑️</p>
          <h1 className="mt-3 text-2xl font-black text-[#102013]">
            Report This Bin
          </h1>
          <p className="mt-1 text-sm font-bold text-[#4c616c]">{bin.name}</p>
          <p className="text-xs text-[#4c616c]">{bin.location_name}</p>
        </div>

        {/* Condition Selector */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4c616c]">
            What is the bin condition?
          </p>

          {CONDITIONS.map((c) => (
            <button
              key={c.value}
              onClick={() => setCondition(c.value)}
              className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                condition === c.value
                  ? "border-[#176d25] bg-green-50"
                  : "border-black/5 bg-white hover:border-[#176d25]/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.emoji}</span>
                <div>
                  <p className="font-bold text-[#191c1d]">{c.label}</p>
                  <p className="text-xs text-[#4c616c]">{c.description}</p>
                </div>
                {condition === c.value && (
                  <span className="ml-auto text-[#176d25]">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Student ID Input */}
        <div className="mt-6">
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#4c616c]">
            Student ID{" "}
            <span className="normal-case font-normal text-[#4c616c]">
              (optional — earn points)
            </span>
          </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. STU-2024-0142"
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20"
          />
        </div>

        {error && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-[#176d25] py-4 font-bold text-white transition-colors hover:bg-[#12581e] disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>

        <p className="mt-4 text-center text-xs text-[#4c616c]">
          No login required. Your report helps keep campus clean.
        </p>
      </div>
    </div>
  );
}
