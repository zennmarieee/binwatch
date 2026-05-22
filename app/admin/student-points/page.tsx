import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../components/LogoutButton";
import AdminStudentLookup from "../components/AdminStudentLookup";
import { ArrowLeft, Award, Search } from "lucide-react";

type StudentPointsRow = {
  student_id: string;
  total_points: number;
  report_count: number;
  last_activity: string;
};

function formatTimestamp(dateStr: string) {
  return new Date(dateStr).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminStudentPointsPage() {
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

  const { data: rankingRows } = await supabase
    .from("student_points")
    .select("student_id, total_points, report_count, last_activity")
    .order("total_points", { ascending: false })
    .order("report_count", { ascending: false })
    .limit(25);

  const ranking = (rankingRows ?? []) as StudentPointsRow[];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,32,19,0.08),transparent_32%),linear-gradient(180deg,#f8faf8_0%,#eef3ef_100%)] p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                <Award className="h-3.5 w-3.5" />
                Student Points
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Lookup and ranking
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Search a student, confirm or adjust points, and review the
                current leaderboard.
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <AdminStudentLookup />

        <section className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Leaderboard
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                Top student points
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Ranked by total points, then report count.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              <Search className="h-4 w-4 text-emerald-700" />
              Use the lookup panel above to search a student directly.
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Student ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Points
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Reports
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {ranking.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-sm text-slate-500"
                    >
                      No student points records yet.
                    </td>
                  </tr>
                )}
                {ranking.map((row, index) => (
                  <tr
                    key={row.student_id}
                    className={`border-b border-slate-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 text-slate-900">
                      {row.student_id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-700">
                      {row.total_points.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {row.report_count}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatTimestamp(row.last_activity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
