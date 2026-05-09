import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#f7faf7] p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black text-[#102013]">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#4c616c]">
          Logged in as {user.email}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href="/admin/bins"
            className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-green-700">
              Manage
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-[#191c1d]">
              Bins
            </h2>
            <p className="mt-1 text-sm text-[#4c616c]">
              Register, view, and deactivate campus bins.
            </p>
          </a>

          <a
            href="/admin/staff"
            className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-green-700">
              Manage
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-[#191c1d]">
              Staff
            </h2>
            <p className="mt-1 text-sm text-[#4c616c]">
              Create and manage staff accounts.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}