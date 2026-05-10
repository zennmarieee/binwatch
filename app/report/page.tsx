import { createClient } from "@/lib/supabase/server";
import ReportClient from "./ReportClient";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ bin?: string }>;
}) {
  const { bin: binId } = await searchParams;

  // No bin ID in URL
  if (!binId) redirect("/");

  const supabase = await createClient();

  // Fetch the bin
  const { data: bin, error } = await supabase
    .from("bins")
    .select("*")
    .eq("id", binId)
    .eq("is_active", true)
    .single();

  // Bin not found or inactive
  if (error || !bin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7faf7] px-4">
        <div className="w-full max-w-sm rounded-3xl border border-black/5 bg-white p-8 text-center shadow-lg">
          <p className="text-4xl">🗑️</p>
          <h1 className="mt-4 text-xl font-extrabold text-[#102013]">
            Bin Not Found
          </h1>
          <p className="mt-2 text-sm text-[#4c616c]">
            This QR code is no longer active or does not exist.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-[#176d25] px-6 py-3 font-bold text-white"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // After fetching the bin, check cooldown
  if (bin.status === "resolved" && bin.resolved_at) {
    const resolvedAt = new Date(bin.resolved_at).getTime();
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const cooldownMs = 15 * 60 * 1000; // 15 minutes

    if (now - resolvedAt > cooldownMs) {
      // Cooldown passed — reset bin to no_active_report
      await supabase
        .from("bins")
        .update({ status: "no_active_report", resolved_at: null })
        .eq("id", bin.id);

      bin.status = "no_active_report";
    }
  }

  // Fetch active report for this bin if any
  const { data: activeReport } = await supabase
    .from("reports")
    .select("*")
    .eq("bin_id", binId)
    .in("status", ["pending", "in_progress"])
    .single();

  return <ReportClient bin={bin} activeReport={activeReport ?? null} />;
}
