import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminStaffClient from "./AdminStaffClient";
import LogoutButton from "../components/LogoutButton";

export default async function AdminStaffPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch all staff and admin accounts
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-[#f7faf7] p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <a
              href="/admin"
              className="text-sm font-bold text-green-700 hover:underline"
            >
              ← Back to Dashboard
            </a>
            <h1 className="mt-2 text-3xl font-black text-[#102013]">
              Staff Management
            </h1>
            <p className="mt-1 text-sm text-[#4c616c]">
              {profiles?.length ?? 0} accounts registered
            </p>
          </div>
          <LogoutButton />
        </div>

        <AdminStaffClient
          profiles={profiles ?? []}
          currentUserId={user.id}
        />
      </div>
    </div>
  );
}