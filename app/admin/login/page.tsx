"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage("Silakan masukkan kata sandi.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage("Autentikasi berhasil! Mengalihkan ke panel redaksi...");
        setTimeout(() => {
          window.location.href = from || "/admin";
        }, 500);
      } else {
        setErrorMessage(data.error || "Kata sandi salah. Akses ditolak.");
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage("Terjadi kendala jaringan saat menghubungi server.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative">
      {/* Neo-brutalist Login Box */}
      <div className="bg-white border-[3px] border-[#623F1B] rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_#623F1B] relative overflow-hidden">
        {/* Washi Tape Decor */}
        <div className="washi-tape-yellow" />
        <div className="washi-tape-red" />

        {/* Card Header */}
        <div className="space-y-3 pt-3 border-b-[2.5px] border-[#623F1B] pb-5">
          <div className="flex items-center justify-between">
            <span className="bg-[#BB240A] text-white px-3 py-1 rounded-full text-[10px] font-mono font-extrabold brutal-badge uppercase tracking-wider">
              KEAMANAN SISTEM
            </span>
            <span className="font-mono text-xs font-bold text-[#623F1B]">
              [VOL. 01 2026]
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-[#38200B]">
            Autentikasi Redaksi
          </h1>

          <p className="font-body text-xs sm:text-sm text-[#623F1B] leading-relaxed">
            Area terbatas. Masukkan kata sandi otorisasi untuk mengelola arsip, berita, dan kurasi konten.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-6">
          {errorMessage && (
            <div className="p-3.5 bg-[#BB240A]/10 border-[2px] border-[#BB240A] rounded-xl font-mono text-xs font-bold text-[#BB240A] flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-1.5">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-base cursor-pointer hover:opacity-70"
              >
                ✕
              </button>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-[#EDCC4D] border-[2px] border-[#623F1B] rounded-xl font-mono text-xs font-extrabold text-[#38200B] flex items-center gap-2 shadow-[2px_2px_0px_#623F1B] animate-in fade-in">
              <span>✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="admin-password"
                className="font-mono text-xs font-extrabold uppercase text-[#38200B] tracking-wider"
              >
                KATA SANDI AKSES
              </label>
              <span className="text-[10px] font-mono text-[#623F1B]">*Wajib diisi</span>
            </div>

            <div className="relative flex items-center">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Masukkan kata sandi..."
                disabled={loading}
                className="w-full px-4 py-3.5 pr-12 bg-[#F7F3EE] border-[2px] border-[#623F1B] rounded-xl font-body font-bold text-sm sm:text-base text-[#38200B] placeholder:text-[#623F1B]/40 focus:outline-none focus:ring-2 focus:ring-[#BB240A] shadow-[3px_3px_0px_#623F1B] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-base text-[#623F1B] hover:text-[#38200B] cursor-pointer"
                title={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                aria-label={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#BB240A] hover:bg-[#38200B] text-white font-mono font-extrabold text-sm sm:text-base brutal-pill flex items-center justify-center gap-2 shadow-[3px_3px_0px_#623F1B] disabled:opacity-50 cursor-pointer transition-all"
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block">⏳</span>
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>MASUK KE PANEL REDAKSI</span>
                <span>➔</span>
              </>
            )}
          </button>
        </form>

        {/* Footer stamp within card */}
        <div className="mt-8 pt-4 border-t-[1.5px] border-dashed border-[#623F1B]/30 flex items-center justify-between text-[11px] font-mono text-[#623F1B]">
          <div className="flex items-center gap-2">
            <span className="text-[#BB240A] font-bold">🔒</span>
            <span>Akses Terenkripsi</span>
          </div>
          <span className="font-extrabold">WIS(UDAH) ID</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#38200B] flex flex-col selection:bg-[#EDCC4D] selection:text-[#38200B]">
      {/* Retro Ribbon */}
      <div className="checkerboard-strip" />

      {/* Top Simple Bar */}
      <header className="border-b-[2.5px] border-[#623F1B] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-[#38200B] group-hover:text-[#BB240A] transition-colors">
              WIS<span className="text-[#BB240A] font-mono">(</span>UDAH<span className="text-[#BB240A] font-mono">)</span>
            </span>
            <span className="hidden sm:inline-block bg-[#EDCC4D] text-[#38200B] text-[10px] font-mono font-extrabold px-2 py-0.5 rounded brutal-badge transform -rotate-2">
              PORTAL ADMIN
            </span>
          </Link>

          <Link
            href="/"
            className="font-mono text-xs font-bold text-[#623F1B] hover:text-[#BB240A] flex items-center gap-1.5 transition-colors bg-[#E5DBD1] hover:bg-[#EDCC4D] px-3.5 py-1.5 rounded-lg border border-[#623F1B] brutal-badge"
          >
            <span>← Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      {/* Center Login Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <Suspense
          fallback={
            <div className="p-8 font-mono text-sm font-bold text-[#623F1B]">
              Memuat formulir login...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* Clean Footer */}
      <footer className="border-t-[2.5px] border-[#623F1B] bg-white py-4 text-center font-mono text-xs text-[#623F1B]">
        <div>KELOMPOK 2 &bull; WIS(UDAH) Media Siber</div>
      </footer>
    </div>
  );
}
