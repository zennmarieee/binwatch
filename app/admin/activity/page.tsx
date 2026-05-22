import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { Activity, ArrowLeft, Clock3 } from "lucide-react";

type ActivityLogRow = {
  id: string;
  action: string;
  notes: string | null;
  created_at: string;
  performed_by: string | null;
  bins: {
    name: string;
    location_name: string;
  } | null;
};

export default async function AdminActivityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/staff");

  // Fetch activity logs with related data
  const { data: rawLogs } = await supabase
    .from("activity_logs")
    .select(
      `
      *,
      bins (
        name,
        location_name
      ),
      reports (
        condition,
        student_id
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const logs = rawLogs as ActivityLogRow[] | null;

  // Fetch all profiles for name lookup
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role");

  const profileMap: Record<string, string> = {};
  profiles?.forEach((p) => {
    profileMap[p.id] = p.full_name ?? "Unknown";
  });

  function formatTimestamp(dateStr: string) {
    return new Date(dateStr).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function actionLabel(action: string) {
    switch (action) {
      case "report_submitted":
        return {
          label: "Report Submitted",
          color: "bg-blue-100 text-blue-700",
        };
      case "report_claimed":
        return {
          label: "Report Claimed",
          color: "bg-orange-100 text-orange-700",
        };
      case "report_resolved":
        return { label: "Report Resolved", color: "bg-teal-100 text-teal-700" };
      default:
        return { label: action, color: "bg-gray-100 text-gray-700" };
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_28%),linear-gradient(180deg,#f8faf8_0%,#eef3ef_100%)] p-6 sm:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <h1 className="mt-3 flex items-center gap-3 text-3xl font-black tracking-tight text-slate-900">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Activity className="h-5 w-5" />
                </span>
                Activity Log
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Last 50 system actions
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Log Table */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Bin
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Performed By
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  When
                </th>
              </tr>
            </thead>
            <tbody>
              {logs?.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    No activity yet.
                  </td>
                </tr>
              )}
              {logs?.map((log, i) => {
                const { label, color } = actionLabel(log.action);
                const performedBy = log.performed_by
                  ? (profileMap[log.performed_by] ?? "Unknown Staff")
                  : "Student";

                return (
                  <tr
                    key={log.id}
                    className={`border-b border-slate-200 ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}
                      >
                        {label}
                      </span>
                      {log.notes && (
                        <p className="mt-1 text-xs text-slate-500">
                          {log.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">
                        {log.bins?.name ?? "—"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {log.bins?.location_name ?? ""}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {performedBy}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatTimestamp(log.created_at)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
