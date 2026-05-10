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
            bg: "bg-blue-50",
            text: "text-blue-700",
          },
          {
            label: "Resolved",
            value: data.statusCounts.resolved.toString(),
            bg: "bg-teal-50",
            text: "text-teal-700",
          },
          {
            label: "Avg Resolution",
            value: data.avgResolutionMins > 0
              ? formatMins(data.avgResolutionMins)
              : "N/A",
            bg: "bg-green-50",
            text: "text-green-700",
          },
          {
            label: "Students Participating",
            value: data.totalStudents.toString(),
            bg: "bg-purple-50",
            text: "text-purple-700",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-3xl ${stat.bg} p-5`}
          >
            <p className={`text-xs font-bold uppercase tracking-widest ${stat.text}`}>
              {stat.label}
            </p>
            <p className={`mt-2 text-3xl font-black ${stat.text}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-extrabold text-[#191c1d]">
          Reports by Status
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Pending",
              count: data.statusCounts.pending,
              color: "bg-red-100 text-red-700",
            },
            {
              label: "In Progress",
              count: data.statusCounts.in_progress,
              color: "bg-orange-100 text-orange-700",
            },
            {
              label: "Resolved",
              count: data.statusCounts.resolved,
              color: "bg-teal-100 text-teal-700",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl px-4 py-3 ${item.color}`}
            >
              <p className="text-xs font-bold uppercase tracking-widest">
                {item.label}
              </p>
              <p className="mt-1 text-2xl font-black">{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reports Last 7 Days Chart */}
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-extrabold text-[#191c1d]">
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
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.dailyData.map((_, index) => (
                <Cell key={index} fill="#176d25" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Most Reported Bins */}
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-extrabold text-[#191c1d]">
          Most Reported Bins
        </h3>
        {data.topBins.length === 0 ? (
          <p className="text-sm text-[#4c616c]">No report data yet.</p>
        ) : (
          <div className="space-y-3">
            {data.topBins.map((bin, i) => {
              const max = data.topBins[0].count;
              const pct = Math.round((bin.count / max) * 100);
              return (
                <div key={bin.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-bold text-[#191c1d]">
                      <span className="mr-2 text-xs text-[#4c616c]">
                        #{i + 1}
                      </span>
                      {bin.name}
                    </p>
                    <p className="text-sm font-bold text-green-700">
                      {bin.count} report{bin.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-green-600 transition-all"
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