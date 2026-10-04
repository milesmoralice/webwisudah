"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (!confirm("Apakah Anda yakin ingin keluar dari panel admin?")) return;
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#BB240A]/10 hover:bg-[#BB240A] text-[#BB240A] hover:text-white border border-[#BB240A] font-mono text-xs font-bold brutal-badge transition-colors cursor-pointer flex items-center gap-1.5"
      title="Keluar dari sesi admin"
    >
      <span>🚪</span>
      <span>{loading ? "Keluar..." : "Keluar"}</span>
    </button>
  );
}
