"use client";

import { useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  isPublished: boolean;
  featured: boolean;
  views: number;
  createdAt: Date | string;
  category: { id: string; name: string; slug: string };
  author: { name: string | null };
  _count?: { comments: number };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface AdminArticleTableProps {
  initialArticles: ArticleItem[];
  categories: CategoryItem[];
}

export default function AdminArticleTable({
  initialArticles,
  categories,
}: AdminArticleTableProps) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setArticles(
          articles.map((a) => (a.id === id ? { ...a, isPublished: !currentStatus } : a))
        );
        showToast(
          !currentStatus ? "Berita berhasil diterbitkan ke publik!" : "Berita dipindahkan ke draf."
        );
      } else {
        alert(data.error || "Gagal mengubah status publikasi");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = window.confirm(`Hapus berita "${title}" secara permanen?`);
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setArticles(articles.filter((a) => a.id !== id));
        showToast("Berita telah berhasil dihapus dari arsip.");
      } else {
        alert(data.error || "Gagal menghapus berita");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered items
  const filtered = articles.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || item.category.id === selectedCategory;

    const matchesStatus =
      selectedStatus === "ALL" ||
      (selectedStatus === "PUBLISHED" && item.isPublished) ||
      (selectedStatus === "DRAFT" && !item.isPublished);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#38200B] text-[#EDCC4D] border-[2px] border-[#623F1B] px-5 py-3 rounded-xl shadow-[5px_5px_0px_#623F1B] font-mono text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border-[2.5px] border-[#623F1B] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#623F1B] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul berita atau slug..."
            className="w-full px-3.5 py-2 pl-9 bg-[#F7F3EE] border-[1.5px] border-[#623F1B] rounded-lg font-body text-xs sm:text-sm text-[#38200B] focus:outline-none focus:ring-2 focus:ring-[#BB240A]"
          />
          <span className="absolute left-3 top-2.5 text-xs text-[#623F1B]">🔍</span>
        </div>

        {/* Category & Status Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#623F1B] font-bold">Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#F7F3EE] border-[1.5px] border-[#623F1B] px-2.5 py-2 rounded-lg font-bold text-[#38200B] focus:outline-none"
            >
              <option value="ALL">Semua Kategori ({articles.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#623F1B] font-bold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#F7F3EE] border-[1.5px] border-[#623F1B] px-2.5 py-2 rounded-lg font-bold text-[#38200B] focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="PUBLISHED">Diterbitkan (Live)</option>
              <option value="DRAFT">Draf Redaksi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border-[2.5px] border-[#623F1B] rounded-2xl shadow-[5px_5px_0px_#623F1B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#E5DBD1] border-b-[2px] border-[#623F1B] font-mono text-[11px] font-extrabold text-[#38200B] uppercase tracking-wider">
                <th className="p-3.5 pl-5">Sampul</th>
                <th className="p-3.5">Judul & Kategori</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Pilihan</th>
                <th className="p-3.5 text-center">Pembaca</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5 pr-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-[1.5px] divide-[#623F1B]/20 font-body text-xs sm:text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#623F1B] font-mono">
                    <div className="text-2xl mb-1">📭</div>
                    Tidak ditemukan berita dengan filter ini.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#EDCC4D]/10 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <td className="p-3.5 pl-5">
                      {item.coverImage ? (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border-[1.5px] border-[#623F1B] shrink-0 bg-zinc-900">
                          <SafeImage
                            src={item.coverImage}
                            fallbackSrc="/images/cerita/cerita-01-makassar.jpg"
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-[#E5DBD1] border-[1.5px] border-[#623F1B] flex items-center justify-center font-mono font-bold text-[10px] text-[#38200B]">
                          NO IMG
                        </div>
                      )}
                    </td>

                    {/* Title & Category */}
                    <td className="p-3.5 max-w-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#BB240A] text-white text-[10px] font-mono font-extrabold px-2 py-0.5 rounded brutal-badge uppercase">
                            {item.category.name}
                          </span>
                          <span className="font-mono text-[10px] text-[#623F1B] truncate">
                            /{item.slug}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-[#38200B] group-hover:text-[#BB240A] transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleTogglePublish(item.id, item.isPublished)}
                        disabled={togglingId === item.id}
                        className={`font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          item.isPublished
                            ? "bg-[#25D366]/20 text-[#1E7E34] border-[#25D366] hover:bg-[#25D366]/30"
                            : "bg-[#BB240A]/15 text-[#BB240A] border-[#BB240A] hover:bg-[#BB240A]/25"
                        }`}
                        title="Klik untuk mengubah status"
                      >
                        {togglingId === item.id ? (
                          "Memproses..."
                        ) : item.isPublished ? (
                          "✓ TERBIT (LIVE)"
                        ) : (
                          "✎ DRAF REDAKSI"
                        )}
                      </button>
                    </td>

                    {/* Featured */}
                    <td className="p-3.5 text-center">
                      {item.featured ? (
                        <span className="bg-[#EDCC4D] text-[#38200B] text-[10px] font-mono font-extrabold px-2 py-0.5 rounded border border-[#623F1B]">
                          ★ UTAMA
                        </span>
                      ) : (
                        <span className="text-[#623F1B]/40 font-mono text-xs">-</span>
                      )}
                    </td>

                    {/* Views */}
                    <td className="p-3.5 text-center font-mono text-xs font-bold text-[#38200B]">
                      {item.views}
                    </td>

                    {/* Date */}
                    <td className="p-3.5 font-mono text-[11px] text-[#623F1B] whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-mono text-xs">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/berita/edit/${item.id}`}
                          className="px-2.5 py-1 bg-[#EDCC4D] hover:bg-[#E5DBD1] text-[#38200B] font-bold rounded border border-[#623F1B] brutal-badge transition-colors"
                          title="Edit Berita & Gambar"
                        >
                          ✎ Edit
                        </Link>

                        {/* View Public Button */}
                        <Link
                          href={`/berita/${item.slug}`}
                          target="_blank"
                          className="px-2.5 py-1 bg-white hover:bg-[#E5DBD1] text-[#38200B] font-bold rounded border border-[#623F1B] brutal-badge transition-colors"
                          title="Lihat Halaman Publik"
                        >
                          👁
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={deletingId === item.id}
                          className="px-2.5 py-1 bg-[#BB240A] hover:bg-[#38200B] text-white font-bold rounded border border-[#623F1B] brutal-badge transition-colors cursor-pointer disabled:opacity-50"
                          title="Hapus Berita"
                        >
                          {deletingId === item.id ? "..." : "🗑"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Summary Bar */}
        <div className="bg-[#F7F3EE] border-t-[2px] border-[#623F1B] p-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs font-bold text-[#623F1B]">
          <div>
            Menampilkan {filtered.length} dari {articles.length} total berita di arsip
          </div>
          <div>WIS(UDAH) Content Management v1.0</div>
        </div>
      </div>
    </div>
  );
}
