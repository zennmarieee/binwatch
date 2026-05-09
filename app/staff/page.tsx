import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import StaffDashboardClient from "./StaffDashboardClient";
import LogoutButton from "../admin/components/LogoutButton";

export default async function StaffDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: reports } = await supabase
    .from("reports")
    .select(`
      *,
      bins (
        id,
        name,
        location_name,
        lat,
        lng
      )
    `)
    .in("status", ["pending", "in_progress"])
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-[#f7faf7] p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#102013]">
              Staff Dashboard
            </h1>
            <p className="mt-1 text-sm text-[#4c616c]">
              {reports?.length ?? 0} active reports
            </p>
          </div>
          <LogoutButton />
        </div>

        <StaffDashboardClient
          reports={reports ?? []}
          currentUserId={user.id}
        />
      </div>
    </div>
  );
}