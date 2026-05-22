"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CirclePlus,
  ShieldCheck,
  PencilLine,
  Trash2,
  UserRound,
  UserCog,
  X,
  Save,
} from "lucide-react";

interface Profile {
  id: string;
  role: string;
  full_name: string | null;
  created_at: string;
}

interface Props {
  profiles: Profile[];
  currentUserId: string;
}

export default function AdminStaffClient({ profiles, currentUserId }: Props) {
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "staff",
  });

  const [editForm, setEditForm] = useState({
    full_name: "",
    role: "staff",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleEditChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  function startEdit(profile: Profile) {
    setEditingId(profile.id);
    setEditForm({
      full_name: profile.full_name ?? "",
      role: profile.role,
    });
  }

  async function handleCreateStaff() {
    setError("");
    setSuccess("");

    if (!form.email || !form.password || !form.full_name) {
      setError("All fields are required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/admin/create-staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        role: form.role,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to create account.");
      setLoading(false);
      return;
    }

    setSuccess(`Account created for ${form.email}`);
    setForm({ email: "", password: "", full_name: "", role: "staff" });
    setShowForm(false);
    setLoading(false);
    router.refresh();
  }

  async function handleUpdateStaff(id: string) {
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/update-staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        full_name: editForm.full_name,
        role: editForm.role,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to update account.");
      setLoading(false);
      return;
    }

    setSuccess("Account updated successfully.");
    setEditingId(null);
    setLoading(false);
    router.refresh();
  }

  async function handleDeleteConfirmed() {
    if (!deleteModal) return;
    setLoading(true);

    const res = await fetch("/api/admin/delete-staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteModal.id }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to delete account.");
      setLoading(false);
      setDeleteModal(null);
      return;
    }

    setSuccess(`${deleteModal.name}'s account has been deleted.`);
    setDeleteModal(null);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Create Button */}
      <button
        onClick={() => {
          setShowForm(!showForm);
          setError("");
          setSuccess("");
        }}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
      >
        {showForm ? (
          <X className="h-4 w-4" />
        ) : (
          <CirclePlus className="h-4 w-4" />
        )}
        {showForm ? "Cancel" : "Create Staff Account"}
      </button>

      {/* Success Message */}
      {success && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <UserCog className="h-5 w-5 text-emerald-700" />
            New Staff Account
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Full Name
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="e.g. Juan dela Cruz"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. staff@binwatch.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCreateStaff}
            disabled={loading}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:opacity-50"
          >
            <ShieldCheck className="h-4 w-4" />
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>
      )}

      {/* Staff Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, i) => (
              <Fragment key={profile.id}>
                <tr
                  className={`border-b border-slate-200 ${
                    i % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <UserRound className="h-4 w-4" />
                      </span>
                      <span>{profile.full_name ?? "—"}</span>
                    </div>
                    {profile.id === currentUserId && (
                      <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        profile.role === "admin"
                          ? "bg-violet-50 text-violet-700"
                          : "bg-sky-50 text-sky-700"
                      }`}
                    >
                      {profile.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {profile.id !== currentUserId ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(profile)}
                          className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                        >
                          <PencilLine className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({
                              id: profile.id,
                              name: profile.full_name ?? "this user",
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">
                        Cannot edit yourself
                      </span>
                    )}
                  </td>
                </tr>

                {/* Inline Edit Row */}
                {editingId === profile.id && (
                  <tr className="border-b border-slate-200 bg-slate-50/90">
                    <td colSpan={4} className="px-6 py-4">
                      <div className="flex flex-wrap items-end gap-3">
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            Full Name
                          </label>
                          <input
                            name="full_name"
                            value={editForm.full_name}
                            onChange={handleEditChange}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            Role
                          </label>
                          <select
                            name="role"
                            value={editForm.role}
                            onChange={handleEditChange}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20"
                          >
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <button
                          onClick={() => handleUpdateStaff(profile.id)}
                          disabled={loading}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                        >
                          <Save className="h-4 w-4" />
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-white"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                <Trash2 className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Delete Account
              </h2>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                {deleteModal.name}
              </span>
              &apos;s account? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDeleteConfirmed}
                disabled={loading}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setDeleteModal(null)}
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
