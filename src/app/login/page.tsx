"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Train, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah. Silakan coba lagi.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: "admin@kai.id", role: "Admin", color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100" },
    { email: "ahmad.sutrisno@kai.id", role: "Staff", color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
    { email: "budi.santosa@kai.id", role: "PIC", color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
    { email: "hendra.wijaya@kai.id", role: "Mgmt Rep", color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-zinc-950">
        {/* Mesh gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-950/80 via-zinc-950 to-blue-900/40"></div>
          <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/6 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-amber-500/4 rounded-full blur-3xl"></div>

          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 bg-white/[0.08] backdrop-blur-md rounded-xl flex items-center justify-center border border-white/[0.08]">
              <Train className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white/80 text-[12px] font-semibold tracking-wider uppercase">
                PT Kereta Api Indonesia
              </h2>
              <p className="text-white/30 text-[10px]">(Persero)</p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl xl:text-[42px] font-bold text-white leading-[1.15] mb-5 tracking-tight">
            Sistem Informasi
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              Pengelolaan Keluhan
            </span>
            <br />
            Pelanggan
          </h1>

          <p className="text-zinc-400 text-[15px] max-w-lg leading-relaxed mb-10">
            Digitalisasi pengelolaan dan penanganan keluhan pelanggan untuk
            meningkatkan kualitas pelayanan PT KAI.
          </p>

          {/* Feature highlights */}
          <div className="space-y-3">
            {[
              "Pencatatan keluhan otomatis dengan nomor unik",
              "Pelacakan status real-time dari pelaporan hingga verifikasi",
              "Generate laporan PDF sesuai format dokumen resmi",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-blue-400/80"></div>
                <p className="text-zinc-500 text-[13px]">{feature}</p>
              </div>
            ))}
          </div>

          {/* Document ref */}
          <div className="mt-20 pt-5 border-t border-white/[0.06]">
            <p className="text-zinc-600 text-[11px] font-mono">
              FR.SM/TI/033.001 — Dokumentasi Pengelolaan dan Penanganan Keluhan
              Pelanggan
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[380px] animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 gradient-kai rounded-xl flex items-center justify-center">
              <Train className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-900 text-[14px]">SI-PKP</h2>
              <p className="text-[11px] text-zinc-500">
                PT Kereta Api Indonesia
              </p>
            </div>
          </div>

          {/* Welcome */}
          <div className="mb-7">
            <h3 className="text-xl font-bold text-zinc-900 mb-1.5">
              Selamat Datang 👋
            </h3>
            <p className="text-zinc-500 text-[13px]">
              Masuk ke akun Anda untuk mengakses sistem
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 p-3 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[13px] animate-scale-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@kai.id"
                className="form-input"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="form-input pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg mt-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {/* Dev hint — credential pills */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-7 p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
              <p className="text-[11px] font-semibold text-zinc-500 mb-2.5">
                🔑 Akun Demo (Development)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => {
                      setEmail(acc.email);
                      setPassword("password123");
                    }}
                    className={`inline-flex text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors ${acc.color}`}
                  >
                    {acc.role}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-400 mt-2">
                Password: password123
              </p>
            </div>
          )}

          {/* Footer */}
          <p className="mt-8 text-center text-[11px] text-zinc-400">
            © 2026 PT Kereta Api Indonesia (Persero). All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
