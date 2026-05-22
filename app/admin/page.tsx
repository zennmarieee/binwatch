import AdminAnalytics from "./components/AdminAnalytics";
import AdminSettings from "./components/AdminSettings";
import { LayoutDashboard, SlidersHorizontal, BarChart3 } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,32,19,0.08),_transparent_32%),linear-gradient(180deg,_#f8faf8_0%,_#eef3ef_100%)] p-6 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Admin Control Center
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                System overview and settings in a cleaner, more professional
                interface.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Settings", icon: SlidersHorizontal },
                { label: "Analytics", icon: BarChart3 },
                { label: "Operations", icon: LayoutDashboard },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Points Settings */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-900">
              Points Settings
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Configure points earned per report condition.
            </p>
            <AdminSettings />
          </div>

          {/* Analytics */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                System Analytics
              </h2>
              <p className="text-xs text-slate-500">Refreshes every 30s</p>
            </div>
            <AdminAnalytics />
          </div>
        </div>
      </div>
    </div>
  );
}
