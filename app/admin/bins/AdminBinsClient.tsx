"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Bin } from "@/lib/bins";

interface Props {
  bins: Bin[];
}

export default function AdminBinsClient({ bins }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrModal, setQrModal] = useState<{
    binName: string;
    qrCode: string;
  } | null>(null);
  const [generatingQr, setGeneratingQr] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    location_name: "",
    lat: "",
    lng: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAddBin() {
    setError("");

    if (!form.name || !form.location_name || !form.lat || !form.lng) {
      setError("All fields are required.");
      return;
    }

    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);

    if (isNaN(lat) || isNaN(lng)) {
      setError("Latitude and longitude must be valid numbers.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("bins").insert({
      name: form.name,
      location_name: form.location_name,
      lat,
      lng,
      status: "no_active_report",
      is_active: true,
    });

    if (error) {
      setError("Failed to add bin. Please try again.");
      setLoading(false);
      return;
    }

    setForm({ name: "", location_name: "", lat: "", lng: "" });
    setShowForm(false);
    setLoading(false);
    router.refresh();
  }

  async function handleDeactivate(id: string) {
    const confirmed = confirm("Deactivate this bin?");
    if (!confirmed) return;

    await supabase
      .from("bins")
      .update({ is_active: false })
      .eq("id", id);

    router.refresh();
  }

  async function handleReactivate(id: string) {
    await supabase
      .from("bins")
      .update({ is_active: true })
      .eq("id", id);

    router.refresh();
  }

  async function handleGenerateQR(bin: Bin) {
    setGeneratingQr(bin.id);

    const res = await fetch(`/api/bins/${bin.id}/qr`, {
      method: "POST",
    });

    const data = await res.json();

    if (data.qrCode) {
      setQrModal({ binName: bin.name, qrCode: data.qrCode });
      router.refresh();
    }

    setGeneratingQr(null);
  }

  function handleDownloadQR(binName: string, qrCode: string) {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `${binName.replace(/\s+/g, "_")}_QR.png`;
    link.click();
  }

  return (
    <div className="mt-8 space-y-6">

      {/* Add Bin Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="rounded-xl bg-[#176d25] px-6 py-3 font-bold text-white transition-colors hover:bg-[#12581e]"
      >
        {showForm ? "Cancel" : "+ Add New Bin"}
      </button>

      {/* Add Bin Form */}
      {showForm && (
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-extrabold text-[#191c1d]">
            Register New Bin
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Bin Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Library Bin A"
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Location Name
              </label>
              <input
                name="location_name"
                value={form.location_name}
                onChange={handleChange}
                placeholder="e.g. Bldg 9 ICT Building"
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Latitude
              </label>
              <input
                name="lat"
                value={form.lat}
                onChange={handleChange}
                placeholder="e.g. 8.4862"
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Longitude
              </label>
              <input
                name="lng"
                value={form.lng}
                onChange={handleChange}
                placeholder="e.g. 124.6572"
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleAddBin}
            disabled={loading}
            className="mt-4 rounded-xl bg-[#176d25] px-6 py-3 font-bold text-white transition-colors hover:bg-[#12581e] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Bin"}
          </button>
        </div>
      )}

      {/* Bins Table */}
      <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 bg-[#f3f6f3]">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Bin Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Active
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin, i) => (
              <tr
                key={bin.id}
                className={`border-b border-black/5 ${
                  i % 2 === 0 ? "bg-white" : "bg-[#f9faf9]"
                }`}
              >
                <td className="px-6 py-4 font-medium text-[#191c1d]">
                  {bin.name}
                </td>
                <td className="px-6 py-4 text-[#4c616c]">
                  {bin.location_name}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      bin.status === "no_active_report"
                        ? "bg-green-100 text-green-700"
                        : bin.status === "pending"
                        ? "bg-red-100 text-red-700"
                        : bin.status === "in_progress"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {bin.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      bin.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {bin.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {/* QR Button */}
                    <button
                      onClick={() => handleGenerateQR(bin)}
                      disabled={generatingQr === bin.id}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100 disabled:opacity-50"
                    >
                      {generatingQr === bin.id
                        ? "..."
                        : bin.qr_code
                        ? "View QR"
                        : "Gen QR"}
                    </button>

                    {/* Deactivate / Reactivate */}
                    {bin.is_active ? (
                      <button
                        onClick={() => handleDeactivate(bin.id)}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivate(bin.id)}
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 transition-colors hover:bg-green-100"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-xl font-extrabold text-[#191c1d]">
              {qrModal.binName}
            </h2>
            <p className="mt-1 text-sm text-[#4c616c]">
              Print and attach this QR code to the bin.
            </p>

            <div className="mt-6 flex justify-center rounded-2xl bg-[#f3f6f3] p-6">
              <img
                src={qrModal.qrCode}
                alt="QR Code"
                className="h-48 w-48"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  handleDownloadQR(qrModal.binName, qrModal.qrCode)
                }
                className="flex-1 rounded-xl bg-[#176d25] py-3 font-bold text-white transition-colors hover:bg-[#12581e]"
              >
                Download
              </button>
              <button
                onClick={() => setQrModal(null)}
                className="flex-1 rounded-xl border border-black/10 py-3 font-bold text-[#4c616c] transition-colors hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}