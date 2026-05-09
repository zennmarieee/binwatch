import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get total active bins
    const { count: activeBins } = await supabase
      .from("bins")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    // Get reports submitted today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: reportsToday } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString());

    // Get resolve rate (resolved reports vs total reports)
    const { count: totalReports } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true });

    const { count: resolvedReports } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "resolved");

    const resolveRate =
      totalReports && totalReports > 0
        ? Math.round(((resolvedReports ?? 0) / totalReports) * 100)
        : 0;

    return NextResponse.json({
      activeBins: activeBins ?? 0,
      reportsToday: reportsToday ?? 0,
      resolveRate: `${resolveRate}%`,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}