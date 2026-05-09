"use client";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
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