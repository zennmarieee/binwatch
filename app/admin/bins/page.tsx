import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminBinsClient from "./AdminBinsClient";
import LogoutButton from "../components/LogoutButton";
import { ArrowLeft, MapPinned } from "lucide-react";

export default async function AdminBinsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: bins } = await supabase
    .from("bins")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_28%),linear-gradient(180deg,_#f8faf8_0%,_#eef3ef_100%)] p-6 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <a
                href="/admin"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </a>
              <h1 className="mt-3 flex items-center gap-3 text-3xl font-black tracking-tight text-slate-900">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <MapPinned className="h-5 w-5" />
                </span>
                Bin Management
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {bins?.length ?? 0} bins registered
              </p>
            </div>
            <LogoutButton />
          </div>

          <AdminBinsClient bins={bins ?? []} />
        </div>
      </div>
    </div>
  );
}
