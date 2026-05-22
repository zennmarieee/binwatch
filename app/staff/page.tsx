import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import StaffDashboardClient from "./StaffDashboardClient";
import StaffSidebar from "./StaffSidebar";
import MapPreview from "@/components/MapPreview";
import { UserRound } from "lucide-react";

interface Profile {
  full_name: string | null;
  role: string | null;
}

export default async function StaffDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single<Profile>();

  const { data: reports } = await supabase
    .from("reports")
    .select(
      `
    *,
    bins (
      id,
      name,
      location_name,
      lat,
      lng
    )
  `,
    )
    .in("status", ["pending", "in_progress"])
    .order("created_at", { ascending: true });

  const { data: resolvedReports } = await supabase
    .from("reports")
    .select(
      `
    *,
    bins (
      id,
      name,
      location_name
    )
  `,
    )
    .eq("assigned_to", user.id)
    .eq("status", "resolved")
    .order("resolved_at", { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,32,19,0.08),transparent_32%),linear-gradient(180deg,#f8faf8_0%,#eef3ef_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <StaffSidebar
          fullName={profile?.full_name ?? null}
          role={profile?.role ?? null}
          email={user.email ?? null}
          activeReportsCount={reports?.length ?? 0}
          resolvedReportsCount={resolvedReports?.length ?? 0}
        />

        <main className="space-y-6">
          <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  Campus Operations
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  Staff Dashboard
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {reports?.length ?? 0} active reports ready for action.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {profile?.full_name ?? user.email ?? "Logged in user"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {profile?.role ?? "Staff"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  Campus Map
                </p>
                <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900">
                  Bin locations overview
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Use this to orient yourself before claiming or resolving
                  reports.
                </p>
              </div>
            </div>

            <MapPreview />
          </section>

          <section
            id="active-reports"
            className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8"
          >
            <StaffDashboardClient
              reports={reports ?? []}
              resolvedReports={resolvedReports ?? []}
              currentUserId={user.id}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
