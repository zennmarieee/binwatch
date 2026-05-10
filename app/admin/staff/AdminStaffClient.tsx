"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleEditChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        className="rounded-xl bg-[#176d25] px-6 py-3 font-bold text-white transition-colors hover:bg-[#12581e]"
      >
        {showForm ? "Cancel" : "+ Create Staff Account"}
      </button>

      {/* Success Message */}
      {success && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          ✓ {success}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-extrabold text-[#191c1d]">
            New Staff Account
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Full Name
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="e.g. Juan dela Cruz"
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. staff@binwatch.com"
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCreateStaff}
            disabled={loading}
            className="mt-4 rounded-xl bg-[#176d25] px-6 py-3 font-bold text-white transition-colors hover:bg-[#12581e] disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>
      )}

      {/* Staff Table */}
      <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 bg-[#f3f6f3]">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, i) => (
              <>
                <tr
                  key={profile.id}
                  className={`border-b border-black/5 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#f9faf9]"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-[#191c1d]">
                    {profile.full_name ?? "—"}
                    {profile.id === currentUserId && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        profile.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {profile.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#4c616c]">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {profile.id !== currentUserId ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(profile)}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({
                              id: profile.id,
                              name: profile.full_name ?? "this user",
                            })
                          }
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-[#4c616c]">
                        Cannot edit yourself
                      </span>
                    )}
                  </td>
                </tr>

                {/* Inline Edit Row */}
                {editingId === profile.id && (
                  <tr
                    key={`edit-${profile.id}`}
                    className="border-b border-black/5 bg-blue-50"
                  >
                    <td colSpan={4} className="px-6 py-4">
                      <div className="flex flex-wrap items-end gap-3">
                        <div>
                          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                            Full Name
                          </label>
                          <input
                            name="full_name"
                            value={editForm.full_name}
                            onChange={handleEditChange}
                            className="rounded-xl border border-black/10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[#4c616c]">
                            Role
                          </label>
                          <select
                            name="role"
                            value={editForm.role}
                            onChange={handleEditChange}
                            className="rounded-xl border border-black/10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/20"
                          >
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <button
                          onClick={() => handleUpdateStaff(profile.id)}
                          disabled={loading}
                          className="rounded-xl bg-[#176d25] px-4 py-2 text-sm font-bold text-white hover:bg-[#12581e] disabled:opacity-50"
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-xl border border-black/10 px-4 py-2 text-sm font-bold text-[#4c616c] hover:bg-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <span className="text-lg">🗑️</span>
              </div>
              <h2 className="text-xl font-extrabold text-[#191c1d]">
                Delete Account
              </h2>
            </div>

            <p className="mt-4 text-sm text-[#4c616c]">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#191c1d]">
                {deleteModal.name}
              </span>
              &apos;s account? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleDeleteConfirmed}
                disabled={loading}
                className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setDeleteModal(null)}
                disabled={loading}
                className="flex-1 rounded-xl border border-black/10 py-3 font-bold text-[#4c616c] transition-colors hover:bg-gray-50"
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