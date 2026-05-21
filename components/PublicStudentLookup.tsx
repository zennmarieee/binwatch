"use client";

import { FormEvent, useState } from "react";
import {
  Award,
  Clock3,
  FileText,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface RecentReport {
  id: string;
  title: string;
  points: number;
  created_at: string;
}

interface StudentResult {
  studentId: string;
  totalPoints: number;
  reportCount: number;
  lastActivity: string;
  recentReports: RecentReport[];
}

export default function PublicStudentLookup() {
  const supabase = createClient();
  const [studentQuery, setStudentQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [result, setResult] = useState<StudentResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = studentQuery.trim();
    if (!query) return;

    setLoading(true);
    setNotFound(false);
    setResult(null);
    setSubmittedQuery(query);

    // Fetch student points
    const { data: pointsData } = await supabase
      .from("student_points")
      .select("*")
      .eq("student_id", query)
      .single();

    if (!pointsData) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Fetch recent reports for this student
    const { data: reportsData } = await supabase
      .from("reports")
      .select("id, condition, created_at, bin_id, bins(name)")
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
      (r: RawReport) => ({
        id: r.id.slice(0, 8).toUpperCase(),
        title: r.bins?.[0]?.name
          ? `${r.bins[0].name} — ${r.condition.replace(/_/g, " ")}`
          : `Report — ${r.condition.replace(/_/g, " ")}`,
        points: 50,
        created_at: r.created_at,
      }),
    );

    setResult({
      studentId: pointsData.student_id,
      totalPoints: pointsData.total_points,
      reportCount: pointsData.report_count,
      lastActivity: pointsData.last_activity,
      recentReports,
    });

    setLoading(false);
  }

  function timeAgo(dateStr: string) {
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <section id="lookup" className="surface-card rounded-3xl p-8 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <p className="text-sm font-bold uppercase tracking-widest text-green-700">
            Public student lookup
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#191c1d]">
            Check Your Points
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#4c616c]">
            Enter your Student ID to see your points and recent report history.
          </p>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {/* Search Form */}
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

              {/* Clear button */}
              {studentQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setStudentQuery("");
                    setSubmittedQuery("");
                    setResult(null);
                    setNotFound(false);
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

          {/* Result Area */}
          <div className="rounded-3xl border border-dashed border-green-700/30 bg-[#f7faf7] p-5">
            {/* Default state */}
            {!submittedQuery && (
              <>
                <p className="text-sm font-bold text-[#191c1d]">
                  No result yet
                </p>
                <p className="mt-2 text-sm text-[#4c616c]">
                  Enter your Student ID and click Lookup to see your points and
                  contribution history.
                </p>
              </>
            )}

            {/* Loading */}
            {loading && (
              <div className="space-y-3">
                <div className="h-4 w-32 animate-pulse rounded-full bg-gray-200" />
                <div className="h-4 w-48 animate-pulse rounded-full bg-gray-200" />
                <div className="h-4 w-40 animate-pulse rounded-full bg-gray-200" />
              </div>
            )}

            {/* Not found */}
            {!loading && notFound && (
              <>
                <p className="text-sm font-bold text-[#191c1d]">
                  No student found
                </p>
                <p className="mt-2 text-sm text-[#4c616c]">
                  No record found for &quot;{submittedQuery}&quot;. Make sure
                  you&apos;ve submitted at least one report with your Student
                  ID.
                </p>
              </>
            )}

            {/* Result */}
            {!loading && result && (
              <div className="space-y-5">
                {/* Header */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-700">
                    <ShieldCheck
                      className="mr-1 inline-block h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    Match found
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-[#191c1d]">
                    {result.studentId}
                  </h3>
                  <p className="mt-1 text-sm text-[#4c616c]">
                    Last active {timeAgo(result.lastActivity)}
                  </p>
                </div>

                {/* Metrics */}
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

                {/* Recent Reports */}
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
                            +{report.points}
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
