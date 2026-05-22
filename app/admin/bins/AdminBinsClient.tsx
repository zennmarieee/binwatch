"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Bin } from "@/lib/bins";
import {
  Plus,
  QrCode,
  RotateCcw,
  Power,
  MapPinned,
  BadgeInfo,
  Download,
  X,
  PencilLine,
  Save,
} from "lucide-react";

const MapPicker = dynamic(() => import("../components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-70 w-full animate-pulse rounded-xl bg-slate-100" />
  ),
});

interface Props {
  bins: Bin[];
}

function mapBinsForPicker(bins: Bin[]) {
  return bins.map((bin) => ({
    id: bin.id,
    name: bin.name,
    lat: bin.lat,
    lng: bin.lng,
  }));
}

function parseCoordinate(value: string) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function AdminBinsClient({ bins }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingBin, setEditingBin] = useState<Bin | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    location_name: "",
    lat: "",
    lng: "",
  });
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

  function startEditBin(bin: Bin) {
    setEditingBin(bin);
    setEditForm({
      name: bin.name,
      location_name: bin.location_name,
      lat: bin.lat.toString(),
      lng: bin.lng.toString(),
    });
  }

  async function handleEditBin() {
    if (!editingBin) return;
    setError("");

    if (
      !editForm.name ||
      !editForm.location_name ||
      !editForm.lat ||
      !editForm.lng
    ) {
      setError("All fields are required.");
      return;
    }

    const lat = parseFloat(editForm.lat);
    const lng = parseFloat(editForm.lng);

    if (isNaN(lat) || isNaN(lng)) {
      setError("Latitude and longitude must be valid numbers.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("bins")
      .update({
        name: editForm.name,
        location_name: editForm.location_name,
        lat,
        lng,
      })
      .eq("id", editingBin.id);

    if (error) {
      setError("Failed to update bin. Please try again.");
      setLoading(false);
      return;
    }

    setEditingBin(null);
    setLoading(false);
    router.refresh();
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

    await supabase.from("bins").update({ is_active: false }).eq("id", id);

    router.refresh();
  }

  async function handleReactivate(id: string) {
    await supabase.from("bins").update({ is_active: true }).eq("id", id);

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
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
      >
        {showForm ? (
          <RotateCcw className="h-4 w-4" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        {showForm ? "Cancel" : "Add New Bin"}
      </button>

      {/* Add Bin Form */}
      {showForm && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <MapPinned className="h-5 w-5 text-emerald-700" />
            Register New Bin
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Bin Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Library Bin A"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Location Name
              </label>
              <input
                name="location_name"
                value={form.location_name}
                onChange={handleChange}
                placeholder="e.g. Bldg 9 ICT Building"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Pin Location on Map
            </label>
            <MapPicker
              lat={parseCoordinate(form.lat)}
              lng={parseCoordinate(form.lng)}
              onChange={(lat, lng) =>
                setForm({ ...form, lat: lat.toString(), lng: lng.toString() })
              }
              existingBins={mapBinsForPicker(bins)}
            />
          </div>

          {form.lat && form.lng && (
            <div className="mt-3 rounded-xl bg-emerald-50 px-4 py-2.5">
              <p className="text-xs font-semibold text-emerald-700">
                Selected: {parseFloat(form.lat).toFixed(6)},{" "}
                {parseFloat(form.lng).toFixed(6)}
              </p>
            </div>
          )}

          {error && (
            <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}

          <button
            onClick={handleAddBin}
            disabled={loading}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:opacity-50"
          >
            <BadgeInfo className="h-4 w-4" />
            {loading ? "Saving..." : "Save Bin"}
          </button>
        </div>
      )}

      {/* Bins Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Bin Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Active
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin, i) => (
              <tr
                key={bin.id}
                className={`border-b border-slate-200 ${
                  i % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                }`}
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {bin.name}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {bin.location_name}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold leading-none ${
                      bin.status === "no_active_report"
                        ? "bg-emerald-50 text-emerald-700"
                        : bin.status === "pending"
                          ? "bg-rose-50 text-rose-700"
                          : bin.status === "in_progress"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-cyan-50 text-cyan-700"
                    }`}
                  >
                    {bin.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      bin.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {bin.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="grid grid-cols-3 gap-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => startEditBin(bin)}
                      aria-label="Edit bin"
                      title="Edit bin"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700 transition-colors hover:bg-sky-100"
                    >
                      <PencilLine className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit</span>
                    </button>

                    {/* QR Button */}
                    <button
                      onClick={() => handleGenerateQR(bin)}
                      disabled={generatingQr === bin.id}
                      aria-label={bin.qr_code ? "View QR" : "Generate QR"}
                      title={bin.qr_code ? "View QR" : "Generate QR"}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      <span className="sr-only">
                        {generatingQr === bin.id
                          ? "Generating QR"
                          : bin.qr_code
                            ? "View QR"
                            : "Generate QR"}
                      </span>
                    </button>

                    {/* Deactivate / Reactivate */}
                    {bin.is_active ? (
                      <button
                        onClick={() => handleDeactivate(bin.id)}
                        aria-label="Deactivate bin"
                        title="Deactivate bin"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-700 transition-colors hover:bg-rose-100"
                      >
                        <Power className="h-3.5 w-3.5" />
                        <span className="sr-only">Deactivate</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivate(bin.id)}
                        aria-label="Reactivate bin"
                        title="Reactivate bin"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span className="sr-only">Reactivate</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Bin Modal */}
      {editingBin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
            <div className="border-b border-slate-200 bg-linear-to-r from-white via-slate-50 to-sky-50 px-8 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
                    <PencilLine className="h-3.5 w-3.5 text-sky-700" />
                    Edit Bin
                  </div>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                    {editingBin.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Update bin details. Changes reflect on the map immediately.
                  </p>
                </div>
                <button
                  onClick={() => setEditingBin(null)}
                  className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
                  aria-label="Close edit modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[90vh] overflow-y-auto px-8 py-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Bin Name
                  </label>
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Location Name
                  </label>
                  <input
                    value={editForm.location_name}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        location_name: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Adjust Pin Location
                </label>
                <MapPicker
                  lat={parseCoordinate(editForm.lat)}
                  lng={parseCoordinate(editForm.lng)}
                  onChange={(lat, lng) =>
                    setEditForm({
                      ...editForm,
                      lat: lat.toString(),
                      lng: lng.toString(),
                    })
                  }
                  existingBins={mapBinsForPicker(bins)}
                  currentBinId={editingBin?.id}
                />
              </div>

              {editForm.lat && editForm.lng && (
                <div className="mt-3 rounded-xl bg-sky-50 px-4 py-2.5">
                  <p className="text-xs font-semibold text-sky-700">
                    Selected: {parseFloat(editForm.lat).toFixed(6)},{" "}
                    {parseFloat(editForm.lng).toFixed(6)}
                  </p>
                </div>
              )}

              {error && (
                <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {error}
                </p>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleEditBin}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditingBin(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
            <div className="border-b border-slate-200 bg-linear-to-r from-white via-slate-50 to-emerald-50 px-8 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
                    <QrCode className="h-3.5 w-3.5 text-emerald-700" />
                    Bin QR
                  </div>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                    {qrModal.binName}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Print and attach this QR code to the bin for quick
                    reporting.
                  </p>
                </div>
                <button
                  onClick={() => setQrModal(null)}
                  className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
                  aria-label="Close QR modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="px-8 py-8">
              <div className="flex justify-center rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <Image
                  src={qrModal.qrCode}
                  alt="QR Code"
                  className="h-48 w-48"
                  width={192}
                  height={192}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    handleDownloadQR(qrModal.binName, qrModal.qrCode)
                  }
                  className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={() => setQrModal(null)}
                  className="flex min-w-0 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
