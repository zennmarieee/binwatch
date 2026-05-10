import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";

export default async function AdminActivityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/staff");

  // Fetch activity logs with related data
  const { data: logs } = await supabase
    .from("activity_logs")
    .select(`
      *,
      bins (
        name,
        location_name
      ),
      reports (
        condition,
        student_id
      )
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  // Fetch all profiles for name lookup
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role");

  const profileMap: Record<string, string> = {};
  profiles?.forEach((p) => {
    profileMap[p.id] = p.full_name ?? "Unknown";
  });

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  function actionLabel(action: string) {
    switch (action) {
      case "report_submitted": return { label: "Report Submitted", color: "bg-blue-100 text-blue-700" };
      case "report_claimed":   return { label: "Report Claimed",   color: "bg-orange-100 text-orange-700" };
      case "report_resolved":  return { label: "Report Resolved",  color: "bg-teal-100 text-teal-700" };
      default:                 return { label: action,              color: "bg-gray-100 text-gray-700" };
    }
  }

  return (
    <div className="min-h-screen bg-[#f7faf7] p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-bold text-green-700 hover:underline"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-black text-[#102013]">
              Activity Log
            </h1>
            <p className="mt-1 text-sm text-[#4c616c]">
              Last 50 system actions
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Log Table */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-[#f3f6f3]">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                  Bin
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                  Performed By
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                  When
                </th>
              </tr>
            </thead>
            <tbody>
              {logs?.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-sm text-[#4c616c]"
                  >
                    No activity yet.
                  </td>
                </tr>
              )}
              {logs?.map((log, i) => {
                const { label, color } = actionLabel(log.action);
                const performedBy = log.performed_by
                  ? profileMap[log.performed_by] ?? "Unknown Staff"
                  : "Student";

                return (
                  <tr
                    key={log.id}
                    className={`border-b border-black/5 ${
                      i % 2 === 0 ? "bg-white" : "bg-[#f9faf9]"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>
                        {label}
                      </span>
                      {log.notes && (
                        <p className="mt-1 text-xs text-[#4c616c]">
                          {log.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#191c1d]">
                        {(log.bins as any)?.name ?? "—"}
                      </p>
                      <p className="text-xs text-[#4c616c]">
                        {(log.bins as any)?.location_name ?? ""}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#191c1d]">
                      {performedBy}
                    </td>
                    <td className="px-6 py-4 text-[#4c616c]">
                      {timeAgo(log.created_at)}
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