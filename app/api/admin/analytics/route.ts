import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  // Total reports
  const { count: totalReports } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true });

  // Reports by status
  const { data: reportsByStatus } = await supabase
    .from("reports")
    .select("status");

  const statusCounts = {
    pending: 0,
    in_progress: 0,
    resolved: 0,
  };

  reportsByStatus?.forEach((r) => {
    if (r.status in statusCounts) {
      statusCounts[r.status as keyof typeof statusCounts]++;
    }
  });

  // Average resolution time (in minutes)
  const { data: resolvedReports } = await supabase
    .from("reports")
    .select("created_at, resolved_at")
    .eq("status", "resolved")
    .not("resolved_at", "is", null);

  let avgResolutionMins = 0;
  if (resolvedReports && resolvedReports.length > 0) {
    const totalMins = resolvedReports.reduce((acc, r) => {
      const created = new Date(r.created_at).getTime();
      const resolved = new Date(r.resolved_at).getTime();
      return acc + (resolved - created) / 60000;
    }, 0);
    avgResolutionMins = Math.round(totalMins / resolvedReports.length);
  }

  // Most reported bins (top 5)
  // Most reported bins (top 5)
  const { data: allReports } = await supabase.from("reports").select(`
    bin_id,
    bins!inner (
      name
    )
  `);

  const binCounts: Record<string, { name: string; count: number }> = {};

  allReports?.forEach((r: any) => {
    const binId = r.bin_id;
    const binName = r.bins?.name ?? null;

    if (!binName) return; // skip if no bin name

    if (!binCounts[binId]) {
      binCounts[binId] = { name: binName, count: 0 };
    }
    binCounts[binId].count++;
  });

  const topBins = Object.values(binCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Reports in last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: recentReports } = await supabase
    .from("reports")
    .select("created_at")
    .gte("created_at", sevenDaysAgo.toISOString());

  // Group by day
  const dailyCounts: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    dailyCounts[key] = 0;
  }

  recentReports?.forEach((r) => {
    const key = new Date(r.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (key in dailyCounts) dailyCounts[key]++;
  });

  const dailyData = Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count,
  }));

  // Total students participating
  const { count: totalStudents } = await supabase
    .from("student_points")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({
    totalReports: totalReports ?? 0,
    statusCounts,
    avgResolutionMins,
    topBins,
    dailyData,
    totalStudents: totalStudents ?? 0,
  });
}
