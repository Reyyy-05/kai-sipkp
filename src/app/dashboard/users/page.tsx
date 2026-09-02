"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Mail,
  Phone,
  Shield,
  Briefcase,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  position: string | null;
  isActive: boolean;
  createdAt: string;
  _count: {
    createdComplaints: number;
    verifiedComplaints: number;
  };
}

function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { label: string; color: string }> = {
    admin: { label: "Administrator", color: "bg-purple-100 text-purple-700" },
    staff: { label: "Staff Pelayanan", color: "bg-blue-100 text-blue-700" },
    pic: { label: "PIC Verifikator", color: "bg-emerald-100 text-emerald-700" },
    management_rep: { label: "Management Rep", color: "bg-amber-100 text-amber-700" },
  };
  const { label, color } = config[role] || { label: role, color: "bg-gray-100 text-gray-700" };
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${color}`}>{label}</span>;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    phone: "",
    position: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setModalOpen(false);
        setForm({
          name: "",
          email: "",
          password: "",
          role: "staff",
          phone: "",
          position: "",
        });
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Gagal membuat pengguna");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Pengguna</h2>
          <p className="text-xs text-slate-500 mt-1">
            Kelola akun petugas, PIC verifikator, dan perwakilan manajemen PT KAI
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary btn-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengguna
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-slate-500">Memuat pengguna...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama Pengguna</th>
                  <th>Kontak</th>
                  <th>Jabatan & Unit</th>
                  <th>Peran (Role)</th>
                  <th>Aktivitas</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr
                    key={u.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-kai text-white text-xs font-bold flex items-center justify-center">
                          {u.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{u.name}</p>
                          <p className="text-xs text-slate-400">ID: #{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-0.5 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{u.email}</span>
                        </div>
                        {u.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.position || "-"}</span>
                      </div>
                    </td>
                    <td>
                      <RoleBadge role={u.role} />
                    </td>
                    <td>
                      <div className="text-xs text-slate-500 space-y-0.5">
                        <span>Input: {u._count.createdComplaints}</span> •{" "}
                        <span>Verif: {u._count.verifiedComplaints}</span>
                      </div>
                    </td>
                    <td>
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-red-700 font-medium bg-red-50 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" />
                          Nonaktif
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Tambah Akun Pengguna Baru
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Daftarkan petugas, staf pelayanan, PIC, atau Management Representative
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama personil"
                  className="form-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="form-label">Alamat Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="nama@kai.id"
                  className="form-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="form-label">Password Sementara</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 karakter"
                  className="form-input text-sm"
                  required
                  minLength={8}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Peran (Role)</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="form-input text-sm"
                  >
                    <option value="staff">Staff Pelayanan</option>
                    <option value="pic">PIC Verifikator</option>
                    <option value="management_rep">Management Rep</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">No. Telepon</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="08..."
                    className="form-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Jabatan / Posisi</label>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="Contoh: Kepala Seksi Pelayanan"
                  className="form-input text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="btn btn-primary btn-sm"
                >
                  {createLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Pengguna"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
