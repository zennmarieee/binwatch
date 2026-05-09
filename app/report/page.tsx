import { createClient } from "@/lib/supabase/server";
import ReportClient from "./ReportClient";
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
        <a
            href="/"
            className="mt-6 inline-block rounded-xl bg-[#176d25] px-6 py-3 font-bold text-white" >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // Fetch active report for this bin if any
  const { data: activeReport } = await supabase
    .from("reports")
    .select("*")
    .eq("bin_id", binId)
    .in("status", ["pending", "in_progress"])
    .single();

  return (
    <ReportClient
      bin={bin}
      activeReport={activeReport ?? null}
    />
  );
}