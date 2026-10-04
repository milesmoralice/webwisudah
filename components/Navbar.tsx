"use client";

import { useState } from "react";
import Link from "next/link";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="border-b-[2.5px] border-[#623F1B] bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Logo & Vol Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-block group">
              <span className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-[#38200B] group-hover:text-[#BB240A] transition-colors">
                WIS<span className="text-[#BB240A] font-mono">(</span>UDAH<span className="text-[#BB240A] font-mono">)</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block bg-[#EDCC4D] text-[#38200B] text-[10px] font-mono font-extrabold px-2 py-0.5 rounded brutal-badge transform -rotate-2">
              VOL. 01 / 2026
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 font-body font-bold text-xs sm:text-sm text-[#38200B]">
            <Link href="/" className="hover:text-[#BB240A] transition-colors">
              Home
            </Link>
            <Link href="/#tentang" className="hover:text-[#BB240A] transition-colors">
              About
            </Link>
            <Link href="/#cerita" className="hover:text-[#BB240A] transition-colors">
              Cerita
            </Link>
            <Link href="/#temuan" className="hover:text-[#BB240A] transition-colors">
              Temuan
            </Link>
            <Link href="/#kontak" className="hover:text-[#BB240A] transition-colors">
              Kontak
            </Link>
          </nav>

          {/* Right Action: Search & Admin Entry */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Cari berita"
              title="Cari berita (Ctrl+K)"
              className="w-10 h-10 rounded-full bg-[#EDCC4D] hover:bg-[#E5DBD1] border-[2px] border-[#623F1B] flex items-center justify-center text-sm brutal-pill transition-colors cursor-pointer"
            >
              🔍
            </button>

            {/* Quick Admin Access Badge */}
            <Link
              href="/admin"
              className="bg-[#38200B] hover:bg-[#BB240A] text-[#EDCC4D] hover:text-white px-3 sm:px-4 py-2 rounded-full font-mono font-bold text-xs brutal-pill flex items-center gap-1.5 transition-colors"
              title="Masuk ke Panel Admin Berita"
            >
              <span className="text-[11px]">⚙</span>
              <span className="hidden xs:inline sm:inline">ADMIN</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-lg bg-[#E5DBD1] border-[2px] border-[#623F1B] flex items-center justify-center font-bold text-base"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t-[2px] border-[#623F1B] bg-[#F7F3EE] px-4 py-4 space-y-3 font-mono text-xs font-bold text-[#38200B]">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 rounded hover:bg-[#EDCC4D]/30"
            >
              [HOME]
            </Link>
            <Link
              href="/#tentang"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 rounded hover:bg-[#EDCC4D]/30"
            >
              [ABOUT]
            </Link>
            <Link
              href="/#cerita"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 rounded hover:bg-[#EDCC4D]/30"
            >
              [CERITA PILIHAN]
            </Link>
            <Link
              href="/#temuan"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 rounded hover:bg-[#EDCC4D]/30"
            >
              [DATA & TEMUAN]
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 rounded bg-[#38200B] text-[#EDCC4D]"
            >
              [PANEL ADMIN BERITA] ➔
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
