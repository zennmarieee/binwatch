import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/staff");

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7faf7]">
      {/* Sidebar — fixed, never scrolls */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <AdminSidebar
          userEmail={user.email ?? ""}
          userName={profile?.full_name ?? "Admin"}
        />
      </aside>

      {/* Main content — scrolls independently */}
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}