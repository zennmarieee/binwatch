
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold text-[#4c616c] transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200"
    >
      Sign Out
    </button>
  );
}