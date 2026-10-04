"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: { name: string; slug: string };
  publishedAt: string | null;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      fetchSuggestions("");
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const fetchSuggestions = async (searchQuery: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results || []);
      }
    } catch (err) {
      console.error("Search fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    fetchSuggestions(tag);
  };

  if (!isOpen) return null;

  const quickTags = ["Transisi", "Makassar", "Lowongan", "Wawancara", "Portofolio", "Gaji"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#F7F3EE] border-[3px] border-[#623F1B] rounded-2xl shadow-[8px_8px_0px_#623F1B] overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#EDCC4D] border-b-[2.5px] border-[#623F1B] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-[#38200B] tracking-wider uppercase">
            <span>🔍</span>
            <span>ARSIP PENCARIAN WIS(UDAH)</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-white hover:bg-[#BB240A] hover:text-white border-[2px] border-[#623F1B] font-mono text-xs font-extrabold flex items-center justify-center transition-colors shadow-[2px_2px_0px_#623F1B]"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-b-[2px] border-[#623F1B] bg-white">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Ketik topik, judul, atau kata kunci..."
              className="w-full px-4 py-3.5 pl-11 bg-[#F7F3EE] border-[2px] border-[#623F1B] rounded-xl font-body font-bold text-sm sm:text-base text-[#38200B] placeholder:text-[#623F1B]/60 focus:outline-none focus:ring-2 focus:ring-[#BB240A] shadow-[3px_3px_0px_#623F1B]"
            />
            <span className="absolute left-4 text-base text-[#623F1B]">🔎</span>
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  fetchSuggestions("");
                  inputRef.current?.focus();
                }}
                className="absolute right-3.5 text-xs font-mono font-bold bg-[#E5DBD1] hover:bg-[#EDCC4D] px-2 py-0.5 rounded border border-[#623F1B]"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Quick Keywords */}
          <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-xs">
            <span className="text-[11px] font-bold text-[#623F1B]">Topik Populer:</span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-2.5 py-0.5 bg-[#E5DBD1] hover:bg-[#EDCC4D] text-[#38200B] font-bold rounded-md border border-[#623F1B] shadow-[1.5px_1.5px_0px_#623F1B] transition-transform active:translate-y-0.5 text-[11px]"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {loading ? (
            <div className="py-12 text-center font-mono text-sm font-bold text-[#623F1B]">
              <span className="inline-block animate-spin mr-2">⚙</span>
              Membongkar arsip berita...
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="text-3xl">📭</div>
              <p className="font-display font-bold text-lg text-[#38200B]">
                Tidak ada cerita yang cocok dengan &quot;{query}&quot;
              </p>
              <p className="font-body text-xs text-[#623F1B]">
                Coba gunakan kata kunci umum seperti &quot;lulusan&quot;, &quot;kerja&quot;, atau &quot;Makassar&quot;.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between font-mono text-[11px] font-bold text-[#623F1B] px-1">
                <span>{query ? `HASIL PENCARIAN (${results.length})` : "REKOMENDASI ARSIP WIS(UDAH)"}</span>
                <span>TEKAN ESC UNTUK KELUAR</span>
              </div>

              <div className="space-y-2.5">
                {results.map((item) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.slug}`}
                    onClick={onClose}
                    className="group flex gap-4 p-3.5 bg-white hover:bg-[#EDCC4D]/25 border-[2px] border-[#623F1B] rounded-xl shadow-[3px_3px_0px_#623F1B] hover:shadow-[5px_5px_0px_#623F1B] hover:-translate-y-0.5 transition-all"
                  >
                    {item.coverImage ? (
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border-[1.5px] border-[#623F1B] bg-zinc-900">
                        <SafeImage
                          src={item.coverImage}
                          fallbackSrc="/images/cerita/cerita-01-makassar.jpg"
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg bg-[#E5DBD1] border-[1.5px] border-[#623F1B] flex items-center justify-center font-mono font-bold text-xs text-[#38200B]">
                        NEWS
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 bg-[#BB240A] text-white rounded border border-[#623F1B]">
                          {item.category.name}
                        </span>
                        {item.publishedAt && (
                          <span className="font-mono text-[10px] text-[#623F1B]">
                            {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-extrabold text-sm sm:text-base text-[#38200B] group-hover:text-[#BB240A] transition-colors line-clamp-1 leading-snug">
                        {item.title}
                      </h4>

                      {item.excerpt && (
                        <p className="font-body text-xs text-[#623F1B] line-clamp-1">
                          {item.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="hidden sm:flex items-center text-[#BB240A] font-bold text-lg pr-2 group-hover:translate-x-1 transition-transform">
                      ➔
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#E5DBD1] border-t-[2px] border-[#623F1B] px-5 py-2.5 flex items-center justify-between text-[11px] font-mono font-bold text-[#623F1B]">
          <span>WIS(UDAH) Index Arsip</span>
          <span>Klik artikel untuk membaca detail</span>
        </div>
      </div>
    </div>
  );
}
