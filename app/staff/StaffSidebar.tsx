"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  History,
  LayoutDashboard,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import LogoutButton from "../admin/components/LogoutButton";

interface StaffSidebarProps {
  fullName: string | null;
  role: string | null;
  email: string | null;
  activeReportsCount: number;
  resolvedReportsCount: number;
}

export default function StaffSidebar({
  fullName,
  role,
  email,
  activeReportsCount,
  resolvedReportsCount,
}: StaffSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white/95 text-slate-900 shadow-lg backdrop-blur lg:hidden"
        aria-label="Open staff navigation menu"
        aria-expanded={isOpen}
        aria-controls="staff-sidebar-drawer"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close staff navigation menu"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
        <div
          id="staff-sidebar-drawer"
          className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm transform border-r border-slate-200/70 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur transition-transform duration-300 ease-out lg:static lg:w-full lg:translate-x-0 lg:rounded-[28px] lg:border lg:bg-white/90 lg:shadow-[0_20px_60px_rgba(15,23,42,0.08)] ${
            isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-4 lg:block">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Staff Space
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
                  Dashboard
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Review reports, claim work, and keep the campus clean.
                </p>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {fullName ?? email ?? "Logged in user"}
                  </p>
                  <p className="text-xs text-slate-500">{role ?? "Staff"}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2">
                  <Activity className="h-4 w-4 text-emerald-700" />
                  <span>{activeReportsCount} active reports</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-700" />
                  <span>{resolvedReportsCount} in history</span>
                </div>
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              <a
                href="#active-reports"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <Activity className="h-4 w-4 text-emerald-700" />
                Active Reports
              </a>
              <a
                href="#history"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <History className="h-4 w-4 text-slate-600" />
                My History
              </a>
            </nav>

            <div className="mt-auto pt-6">
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
