import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminBinsClient from "./AdminBinsClient";
import LogoutButton from "../components/LogoutButton";

export default async function AdminBinsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: bins } = await supabase
    .from("bins")
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
              Bin Management
            </h1>
            <p className="mt-1 text-sm text-[#4c616c]">
              {bins?.length ?? 0} bins registered
            </p>
          </div>
          <LogoutButton />
        </div>

        <AdminBinsClient bins={bins ?? []} />
      </div>
    </div>
  );
}