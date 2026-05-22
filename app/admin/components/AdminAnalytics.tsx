"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Activity, AlarmClock, BadgeCheck, TrendingUp } from "lucide-react";

interface Analytics {
  totalReports: number;
  statusCounts: {
    pending: number;
    in_progress: number;
    resolved: number;
  };
  avgResolutionMins: number;
  topBins: { name: string; count: number }[];
  dailyData: { date: string; count: number }[];
  totalStudents: number;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      setData(json);
      setLoading(false);
    }

    fetchAnalytics();

    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 w-full animate-pulse rounded-3xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const formatMins = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remaining = mins % 60;
    return remaining > 0 ? `${hrs}h ${remaining}m` : `${hrs}h`;
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Top Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Reports",
            value: data.totalReports.toString(),
            bg: "bg-slate-50",
            text: "text-slate-900",
            icon: Activity,
          },
          {
            label: "Resolved",
            value: data.statusCounts.resolved.toString(),
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            icon: BadgeCheck,
          },
          {
            label: "Avg Resolution",
            value:
              data.avgResolutionMins > 0
                ? formatMins(data.avgResolutionMins)
                : "N/A",
            bg: "bg-teal-50",
            text: "text-teal-700",
            icon: AlarmClock,
          },
          {
            label: "Students Participating",
            value: data.totalStudents.toString(),
            bg: "bg-indigo-50",
            text: "text-indigo-700",
            icon: TrendingUp,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-3xl border border-slate-200/70 ${stat.bg} p-5 shadow-sm`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.22em] ${stat.text}`}
                >
                  {stat.label}
                </p>
                <p
                  className={`mt-2 text-3xl font-black tracking-tight ${stat.text}`}
                >
                  {stat.value}
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 shadow-sm">
                <stat.icon className={`h-5 w-5 ${stat.text}`} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Reports by Status
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Pending",
              count: data.statusCounts.pending,
              color: "bg-rose-50 text-rose-700",
            },
            {
              label: "In Progress",
              count: data.statusCounts.in_progress,
              color: "bg-amber-50 text-amber-700",
            },
            {
              label: "Resolved",
              count: data.statusCounts.resolved,
              color: "bg-emerald-50 text-emerald-700",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border border-slate-200 px-4 py-3 ${item.color}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em]">
                {item.label}
              </p>
              <p className="mt-1 text-2xl font-black tracking-tight">
                {item.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reports Last 7 Days Chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Reports — Last 7 Days
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.dailyData}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#4c616c" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#4c616c" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.dailyData.map((_, index) => (
                <Cell key={index} fill="#0f766e" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Most Reported Bins */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Most Reported Bins
        </h3>
        {data.topBins.length === 0 ? (
          <p className="text-sm text-slate-500">No report data yet.</p>
        ) : (
          <div className="space-y-3">
            {data.topBins.map((bin, i) => {
              const max = data.topBins[0].count;
              const pct = Math.round((bin.count / max) * 100);
              return (
                <div key={bin.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">
                      <span className="mr-2 text-xs text-slate-400">
                        #{i + 1}
                      </span>
                      {bin.name}
                    </p>
                    <p className="text-sm font-semibold text-emerald-700">
                      {bin.count} report{bin.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-600 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
