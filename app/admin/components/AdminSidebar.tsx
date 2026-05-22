"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import {
  LayoutDashboard,
  Award,
  Trash2,
  Users,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface Props {
  userEmail: string;
  userName: string;
}

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Student Points", href: "/admin/student-points", icon: Award },
  { label: "Bins", href: "/admin/bins", icon: Trash2 },
  { label: "Staff", href: "/admin/staff", icon: Users },
  { label: "Activity Log", href: "/admin/activity", icon: ClipboardList },
];

function SidebarContent({
  userName,
  userEmail,
  pathname,
  onNavClick,
  onLogout,
}: {
  userName: string;
  userEmail: string;
  pathname: string;
  onNavClick: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
            <Trash2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-black text-white">BinWatch</p>
            <p className="text-xs text-white/50">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-green-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded-xl bg-white/5 px-4 py-3">
          <p className="text-xs font-semibold text-white">{userName}</p>
          <p className="truncate text-xs text-white/40">{userEmail}</p>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({ userEmail, userName }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 bg-[#0f1f12] lg:flex lg:flex-col">
        <SidebarContent
          userName={userName}
          userEmail={userEmail}
          pathname={pathname}
          onNavClick={() => {}}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Top Bar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between bg-[#0f1f12] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-600">
            <Trash2 className="h-3.5 w-3.5 text-white" />
          </div>
          <p className="font-black text-white">BinWatch</p>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-[#0f1f12]">
            <SidebarContent
              userName={userName}
              userEmail={userEmail}
              pathname={pathname}
              onNavClick={() => setMobileOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}
    </>
  );
}
