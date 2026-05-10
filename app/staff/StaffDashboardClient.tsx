"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Bin {
  id: string;
  name: string;
  location_name: string;
  lat: number;
  lng: number;
}

interface Report {
  id: string;
  bin_id: string;
  condition: string;
  student_id: string | null;
  status: string;
  assigned_to: string | null;
  created_at: string;
  bins: Bin;
}

interface Props {
  reports: Report[];
  currentUserId: string;
}

function conditionLabel(condition: string) {
  switch (condition) {
    case "overflowing":
      return { label: "Overflowing", color: "bg-red-100 text-red-700" };
    case "almost_full":
      return { label: "Almost Full", color: "bg-orange-100 text-orange-700" };
    case "damaged":
      return { label: "Damaged", color: "bg-yellow-100 text-yellow-700" };
    default:
      return { label: condition, color: "bg-gray-100 text-gray-700" };
  }
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

export default function StaffDashboardClient({
  reports: initialReports,
  currentUserId,
}: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [reports] = useState(initialReports);
  const [loading, setLoading] = useState<string | null>(null);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 15000);
    return () => clearInterval(interval);
  }, [router]);

  async function handleClaim(reportId: string, binId: string) {
    setLoading(reportId);

    await supabase
      .from("reports")
      .update({
        status: "in_progress",
        assigned_to: currentUserId,
      })
      .eq("id", reportId);

    await supabase
      .from("bins")
      .update({ status: "in_progress" })
      .eq("id", binId);

    await supabase.from("activity_logs").insert({
      report_id: reportId,
      bin_id: binId,
      action: "report_claimed",
      performed_by: currentUserId,
    });

    setLoading(null);
    router.refresh();
  }

  async function handleResolve(reportId: string, binId: string) {
    setLoading(reportId);

    await supabase
      .from("reports")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    await supabase
      .from("bins")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
      })
      .eq("id", binId);

    await supabase.from("activity_logs").insert({
      report_id: reportId,
      bin_id: binId,
      action: "report_resolved",
      performed_by: currentUserId,
    });

    setLoading(null);
    router.refresh();
  }

  if (reports.length === 0) {
    return (
      <div className="mt-12 text-center">
        <p className="text-4xl">✅</p>
        <h2 className="mt-4 text-xl font-extrabold text-[#102013]">
          All Clear
        </h2>
        <p className="mt-2 text-sm text-[#4c616c]">
          No active reports right now. Dashboard refreshes every 15 seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {reports.map((report) => {
        const { label, color } = conditionLabel(report.condition);
        const isAssignedToMe = report.assigned_to === currentUserId;
        const isAssignedToOther =
          report.assigned_to && report.assigned_to !== currentUserId;

        return (
          <div
            key={report.id}
            className={`rounded-3xl border bg-white p-6 shadow-sm ${
              report.status === "in_progress"
                ? "border-orange-200"
                : "border-black/5"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-extrabold text-[#191c1d]">
                    {report.bins.name}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}
                  >
                    {label}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      report.status === "pending"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {report.status === "pending" ? "Pending" : "In Progress"}
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#4c616c]">
                  {report.bins.location_name}
                </p>
                <p className="mt-1 text-xs text-[#4c616c]">
                  Reported {timeAgo(report.created_at)}
                  {report.student_id && ` · by ${report.student_id}`}
                </p>

                {isAssignedToOther && (
                  <p className="mt-2 text-xs font-bold text-orange-600">
                    Claimed by another staff member
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {report.status === "pending" && (
                  <button
                    onClick={() => handleClaim(report.id, report.bin_id)}
                    disabled={loading === report.id}
                    className="rounded-xl bg-[#176d25] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#12581e] disabled:opacity-50"
                  >
                    {loading === report.id ? "..." : "Claim"}
                  </button>
                )}

                {report.status === "in_progress" && isAssignedToMe && (
                  <button
                    onClick={() => handleResolve(report.id, report.bin_id)}
                    disabled={loading === report.id}
                    className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
                  >
                    {loading === report.id ? "..." : "Resolve"}
                  </button>
                )}

                {report.status === "in_progress" && isAssignedToOther && (
                  <span className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-400">
                    Taken
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
