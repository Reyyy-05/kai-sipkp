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

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 gradient-header relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-amber-400/5 rounded-full blur-2xl"></div>

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Train className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-white/90 text-sm font-medium tracking-wider uppercase">
                PT Kereta Api Indonesia
              </h2>
              <p className="text-white/50 text-xs">(Persero)</p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Sistem Informasi
            <br />
            <span className="text-blue-300">Pengelolaan Keluhan</span>
            <br />
            Pelanggan
          </h1>

          <p className="text-blue-200/70 text-lg max-w-lg leading-relaxed mb-12">
            Digitalisasi pengelolaan dan penanganan keluhan pelanggan untuk
            meningkatkan kualitas pelayanan PT KAI.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              "Pencatatan keluhan otomatis dengan nomor unik",
              "Pelacakan status real-time dari pelaporan hingga verifikasi",
              "Generate laporan PDF sesuai format dokumen resmi",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <p className="text-blue-100/80 text-sm">{feature}</p>
              </div>
            ))}
          </div>

          {/* Document ref */}
          <div className="mt-16 pt-6 border-t border-white/10">
            <p className="text-white/30 text-xs">
              Ref: FR.SM/TI/033.001 — Dokumentasi Pengelolaan dan Penanganan
              Keluhan Pelanggan
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 gradient-kai rounded-xl flex items-center justify-center">
              <Train className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">SI-PKP</h2>
              <p className="text-xs text-slate-500">PT Kereta Api Indonesia</p>
            </div>
          </div>

          {/* Welcome */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Selamat Datang 👋
            </h3>
            <p className="text-slate-500 text-sm">
              Masuk ke akun Anda untuk mengakses sistem
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-scale-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="form-input pr-12"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
              className="btn btn-primary w-full btn-lg mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          {/* Dev hint */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-700 mb-2">
                🔑 Akun Demo (Development)
              </p>
              <div className="space-y-1">
                {[
                  { email: "admin@kai.id", role: "Admin" },
                  { email: "ahmad.sutrisno@kai.id", role: "Staff" },
                  { email: "budi.santosa@kai.id", role: "PIC" },
                  { email: "hendra.wijaya@kai.id", role: "Mgmt Rep" },
                ].map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => {
                      setEmail(acc.email);
                      setPassword("password123");
                    }}
                    className="block text-xs text-amber-600 hover:text-amber-800 hover:underline transition-colors"
                  >
                    {acc.role}: {acc.email}
                  </button>
                ))}
                <p className="text-[10px] text-amber-500 mt-1">
                  Password: password123
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <p className="mt-10 text-center text-xs text-slate-400">
            © 2026 PT Kereta Api Indonesia (Persero). All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
