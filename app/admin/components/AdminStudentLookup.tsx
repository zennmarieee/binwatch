"use client";

import { FormEvent, useState } from "react";
import {
  Award,
  BadgeCheck,
  Clock3,
  FileText,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface RecentReport {
  id: string;
  title: string;
  condition: string;
  created_at: string;
}

interface StudentResult {
  studentId: string;
  totalPoints: number;
  reportCount: number;
  lastActivity: string;
  recentReports: RecentReport[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function conditionLabel(condition: string) {
  switch (condition) {
    case "overflowing":
      return "Overflowing";
    case "almost_full":
      return "Almost full";
    case "damaged":
      return "Damaged";
    default:
      return condition.replace(/_/g, " ");
  }
}

export default function AdminStudentLookup() {
  const supabase = createClient();
  const [studentQuery, setStudentQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [result, setResult] = useState<StudentResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adjustment, setAdjustment] = useState("0");
  const [savingAction, setSavingAction] = useState<"confirm" | "adjust" | null>(
    null,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = studentQuery.trim();
    if (!query) return;

    setLoading(true);
    setSavingAction(null);
    setMessage(null);
    setError(null);
    setNotFound(false);
    setResult(null);
    setSubmittedQuery(query);

    const { data: pointsData, error: pointsError } = await supabase
      .from("student_points")
      .select("student_id, total_points, report_count, last_activity")
      .eq("student_id", query)
      .single();

    if (pointsError || !pointsData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const { data: reportsData } = await supabase
      .from("reports")
      .select("id, condition, created_at, bins(name)")
      .eq("student_id", query)
      .order("created_at", { ascending: false })
      .limit(5);

    type RawReport = {
      id: string;
      condition: string;
      created_at: string;
      bins: { name?: string }[] | null;
    };

    const recentReports: RecentReport[] = (reportsData ?? []).map(
      (report: RawReport) => ({
        id: report.id.slice(0, 8).toUpperCase(),
        title: report.bins?.[0]?.name
          ? `${report.bins[0].name} — ${conditionLabel(report.condition)}`
          : `Report — ${conditionLabel(report.condition)}`,
        condition: report.condition,
        created_at: report.created_at,
      }),
    );

    setResult({
      studentId: pointsData.student_id,
      totalPoints: pointsData.total_points,
      reportCount: pointsData.report_count,
      lastActivity: pointsData.last_activity,
      recentReports,
    });
    setAdjustment("0");
    setLoading(false);
  }

  async function getCurrentUserId() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user?.id ?? null;
  }

  async function handleConfirmPoints() {
    if (!result) return;

    setSavingAction("confirm");
    setMessage(null);
    setError(null);

    const performedBy = await getCurrentUserId();

    const { error: logError } = await supabase.from("activity_logs").insert({
      action: "student_points_confirmed",
      notes: `Confirmed points for ${result.studentId} at ${result.totalPoints} points`,
      performed_by: performedBy,
    });

    if (logError) {
      setError("Confirmation was not saved.");
      setSavingAction(null);
      return;
    }

    setMessage(`Confirmed ${result.studentId}'s points.`);
    setSavingAction(null);
  }

  async function handleAdjustPoints() {
    if (!result) return;

    const delta = Number.parseInt(adjustment, 10);
    if (!Number.isFinite(delta) || delta === 0) {
      setError("Enter a non-zero adjustment.");
      return;
    }

    const nextTotal = Math.max(0, result.totalPoints + delta);
    const now = new Date().toISOString();

    setSavingAction("adjust");
    setMessage(null);
    setError(null);

    const { error: updateError } = await supabase
      .from("student_points")
      .update({
        total_points: nextTotal,
        last_activity: now,
      })
      .eq("student_id", result.studentId);

    if (updateError) {
      setError("Point adjustment failed.");
      setSavingAction(null);
      return;
    }

    const performedBy = await getCurrentUserId();

    await supabase.from("activity_logs").insert({
      action: "student_points_adjusted",
      notes: `Adjusted ${result.studentId} by ${delta > 0 ? "+" : ""}${delta} points (${result.totalPoints} -> ${nextTotal})`,
      performed_by: performedBy,
    });

    setResult({
      ...result,
      totalPoints: nextTotal,
      lastActivity: now,
    });
    setMessage(`Updated ${result.studentId} to ${nextTotal} points.`);
    setSavingAction(null);
  }

  return (
    <section
      id="student-lookup"
      className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Admin verification
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Student points lookup
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Check a student&apos;s points, review their recent reports, then
            confirm or correct the total.
          </p>

          <div className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-emerald-700" />
              Confirm the total after manual review.
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-slate-700" />
              Apply a positive or negative adjustment when needed.
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <form
            className="flex flex-col gap-3 rounded-3xl border border-black/5 bg-[#f3f6f3] p-4 sm:flex-row sm:items-center"
            onSubmit={handleLookup}
          >
            <div className="relative w-full">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f6c62]"
                aria-hidden="true"
              />

              <input
                className="w-full rounded-full border border-black/5 bg-white py-4 pl-11 pr-10 text-sm font-medium text-[#191c1d] placeholder:text-[#707a6c] focus:ring-2 focus:ring-green-700/20"
                placeholder="Enter Student ID (e.g. 2023300397)"
                type="text"
                value={studentQuery}
                onChange={(e) => setStudentQuery(e.target.value)}
              />

              {studentQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setStudentQuery("");
                    setSubmittedQuery("");
                    setResult(null);
                    setNotFound(false);
                    setMessage(null);
                    setError(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/5 px-2 py-1 text-xs text-[#4c616c] hover:bg-black/10"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              className="inline-flex items-center justify-center rounded-full bg-[#176d25] px-6 py-4 font-bold text-white transition-colors hover:bg-[#12581e] disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              <Search className="mr-2 h-4 w-4" aria-hidden="true" />
              {loading ? "..." : "Lookup"}
            </button>
          </form>

          <div className="rounded-3xl border border-dashed border-green-700/30 bg-[#f7faf7] p-5">
            {!submittedQuery && (
              <>
                <p className="text-sm font-bold text-[#191c1d]">
                  Ready for verification
                </p>
                <p className="mt-2 text-sm text-[#4c616c]">
                  Search a student ID to review their earned points and take an
                  admin action.
                </p>
              </>
            )}

            {loading && (
              <div className="space-y-3">
                <div className="h-4 w-32 animate-pulse rounded-full bg-gray-200" />
                <div className="h-4 w-48 animate-pulse rounded-full bg-gray-200" />
                <div className="h-4 w-40 animate-pulse rounded-full bg-gray-200" />
              </div>
            )}

            {!loading && notFound && (
              <>
                <p className="text-sm font-bold text-[#191c1d]">
                  No student found
                </p>
                <p className="mt-2 text-sm text-[#4c616c]">
                  No points record exists for &quot;{submittedQuery}&quot; yet.
                </p>
              </>
            )}

            {!loading && result && (
              <div className="space-y-5">
                {message && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    {message}
                  </div>
                )}
                {error && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                    {error}
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-700">
                    <ShieldCheck
                      className="mr-1 inline-block h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Student record loaded
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-[#191c1d]">
                    {result.studentId}
                  </h3>
                  <p className="mt-1 text-sm text-[#4c616c]">
                    Last activity {timeAgo(result.lastActivity)}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: "Total Points",
                      value: result.totalPoints.toLocaleString(),
                      icon: Award,
                    },
                    {
                      label: "Reports",
                      value: result.reportCount.toString(),
                      icon: TrendingUp,
                    },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-black/5 bg-white p-4"
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                        <metric.icon
                          className="mr-1 inline-block h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        {metric.label}
                      </p>
                      <p className="mt-2 text-2xl font-black text-green-700">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#191c1d]">
                        Admin actions
                      </p>
                      <p className="mt-1 text-xs text-[#4c616c]">
                        Confirm after manual review or apply a direct
                        correction.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmPoints}
                      disabled={savingAction !== null}
                      className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                    >
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      {savingAction === "confirm" ? "..." : "Confirm points"}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label className="flex-1">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Point adjustment
                      </span>
                      <input
                        type="number"
                        value={adjustment}
                        onChange={(e) => setAdjustment(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white"
                        placeholder="e.g. 10 or -5"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleAdjustPoints}
                      disabled={savingAction !== null}
                      className="inline-flex items-center justify-center rounded-full bg-[#191c1d] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-black disabled:opacity-50"
                    >
                      {savingAction === "adjust" ? "..." : "Apply adjustment"}
                    </button>
                  </div>
                </div>

                {result.recentReports.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-[#191c1d]">
                        <FileText
                          className="mr-1 inline-block h-4 w-4"
                          aria-hidden="true"
                        />
                        Recent reports
                      </p>
                      <p className="text-xs text-[#4c616c]">
                        <Clock3
                          className="mr-1 inline-block h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        Last active {timeAgo(result.lastActivity)}
                      </p>
                    </div>

                    <div className="mt-3 space-y-2">
                      {result.recentReports.map((report) => (
                        <div
                          key={report.id}
                          className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#191c1d]">
                              {report.title}
                            </p>
                            <p className="text-xs text-[#4c616c]">
                              Ref: {report.id} · {timeAgo(report.created_at)}
                            </p>
                          </div>
                          <span className="rounded-full bg-[#d9f6d4] px-3 py-1 text-xs font-bold text-[#0f4a16]">
                            {conditionLabel(report.condition)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
