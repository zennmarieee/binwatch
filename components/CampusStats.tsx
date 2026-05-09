"use client";

import { useEffect, useState } from "react";

interface Stats {
  activeBins: number;
  reportsToday: number;
  resolveRate: string;
}

export default function CampusStats() {
  const [stats, setStats] = useState<Stats>({
    activeBins: 0,
    reportsToday: 0,
    resolveRate: "0%",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    { label: "Reports today", value: stats.reportsToday.toString() },
    { label: "Active bins",   value: stats.activeBins.toString() },
    { label: "Resolve rate",  value: stats.resolveRate },
  ];

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      {statItems.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-black/5 bg-[#f3f6f3] p-4"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#4c616c]">
            {stat.label}
          </p>
          {loading ? (
            <div className="mt-2 h-8 w-16 animate-pulse rounded-md bg-gray-200" />
          ) : (
            <p className="mt-2 text-2xl font-black text-green-700">
              {stat.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}