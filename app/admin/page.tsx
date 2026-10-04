import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AdminArticleTable from "./AdminArticleTable";
import LogoutButton from "@/components/LogoutButton";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

const FALLBACK_CATEGORIES = [
  { id: "cat-1", name: "Cerita Lulusan", slug: "cerita-lulusan" },
  { id: "cat-2", name: "Dunia Kerja", slug: "dunia-kerja" },
  { id: "cat-3", name: "Data & Temuan", slug: "data-temuan" },
  { id: "cat-4", name: "Perspektif", slug: "perspektif" },
  { id: "cat-5", name: "Kontribusi", slug: "kontribusi" },
];

const FALLBACK_ARTICLES = [
  {
    id: "art-1",
    title: "Menavigasi 100 Hari Pertama Pasca Wisuda: Dari Euforia Toga Menuju Realitas Mencari Arah",
    slug: "menavigasi-100-hari-pertama-pasca-wisuda",
    excerpt: "Membaca perjalanan lulusan menuju dunia kerja. Menelusuri cerita setelah wisuda—dari langkah pertama, pencarian kerja, sampai menemukan ruang untuk bertumbuh.",
    content: "Momen wisuda kerap dirayakan sebagai puncak pencapaian akademik...",
    coverImage: "/images/cerita/cerita-01-makassar.jpg",
    isPublished: true,
    publishedAt: new Date(),
    featured: true,
    views: 1420,
    author: { name: "Redaksi WIS(UDAH)" },
    category: { id: "cat-1", name: "Cerita Lulusan", slug: "cerita-lulusan" },
    createdAt: new Date(),
    _count: { comments: 4 },
  },
  {
    id: "art-2",
    title: "Seni Menghadapi Wawancara Kerja: Cerita Lulusan Pertama yang Menembus Industri Kreatif",
    slug: "seni-menghadapi-wawancara-kerja-industri-kreatif",
    excerpt: "Pengalaman nyata menyusun portofolio relevan dan membangun kepercayaan diri saat bersaing dengan ratusan kandidat.",
    content: "Menghadapi meja wawancara sering kali terasa intimidatif...",
    coverImage: "/images/cerita/cerita-02-hr.jpg",
    isPublished: true,
    publishedAt: new Date(),
    featured: false,
    views: 980,
    author: { name: "Redaksi WIS(UDAH)" },
    category: { id: "cat-1", name: "Cerita Lulusan", slug: "cerita-lulusan" },
    createdAt: new Date(),
    _count: { comments: 2 },
  },
  {
    id: "art-3",
    title: "Gap Year Produktif: Mengubah Masa Tunggu Kerja Menjadi Laboratorium Eksplorasi Diri",
    slug: "gap-year-produktif-eksplorasi-diri",
    excerpt: "Mengapa tidak langsung bekerja bukan berarti tertinggal, melainkan kesempatan memperdalam kompetensi digital.",
    content: "Banyak sarjana merasa cemas ketika tawaran kerja tak kunjung tiba...",
    coverImage: "/images/cerita/cerita-03-dream-job.jpg",
    isPublished: true,
    publishedAt: new Date(),
    featured: false,
    views: 750,
    author: { name: "Redaksi WIS(UDAH)" },
    category: { id: "cat-2", name: "Dunia Kerja", slug: "dunia-kerja" },
    createdAt: new Date(),
    _count: { comments: 1 },
  },
];

export default async function AdminDashboardPage() {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  let articles: any[] = FALLBACK_ARTICLES;
  let categories: any[] = FALLBACK_CATEGORIES;
  let totalViews = 3150;
  let isDbConnected = true;

  try {
    const [dbArticles, dbCategories, totalViewsResult] = await Promise.all([
      prisma.article.findMany({
        include: {
          category: true,
          author: true,
          _count: {
            select: { comments: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.article.aggregate({
        _sum: { views: true },
      }),
    ]);

    if (dbArticles && dbArticles.length > 0) articles = dbArticles;
    if (dbCategories && dbCategories.length > 0) categories = dbCategories;
    if (totalViewsResult?._sum?.views !== undefined && totalViewsResult._sum.views !== null) {
      totalViews = totalViewsResult._sum.views;
    }
  } catch (error) {
    console.error("Prisma fetch failed in admin dashboard:", error);
    isDbConnected = false;
  }

  const totalArticles = articles.length;
  const publishedArticles = articles.filter((a) => a.isPublished).length;
  const draftArticles = totalArticles - publishedArticles;

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#38200B] flex flex-col selection:bg-[#EDCC4D] selection:text-[#38200B]">
      {/* Top Retro Checkerboard */}
      <div className="checkerboard-strip" />

      {/* Admin Top Navigation */}
      <header className="bg-white border-b-[2.5px] border-[#623F1B] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="group">
              <span className="text-xl sm:text-2xl font-extrabold font-display tracking-tight text-[#38200B] group-hover:text-[#BB240A] transition-colors">
                WIS<span className="text-[#BB240A] font-mono">(</span>UDAH<span className="text-[#BB240A] font-mono">)</span>
              </span>
            </Link>
            <span className="bg-[#38200B] text-[#EDCC4D] text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded brutal-badge">
              PANEL REDAKSI
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs font-bold">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-lg bg-[#E5DBD1] hover:bg-[#EDCC4D] text-[#38200B] border border-[#623F1B] brutal-badge transition-colors"
            >
              👁 Lihat Web Publik
            </Link>
            <Link
              href="/admin/berita/tambah"
              className="px-4 py-2 rounded-lg bg-[#BB240A] hover:bg-[#38200B] text-white brutal-pill transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_#623F1B]"
            >
              <span>➕</span>
              <span>Tulis Berita Baru</span>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Page Banner Title */}
        <div className="bg-[#EDCC4D] border-[3px] border-[#623F1B] rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_#623F1B] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#BB240A] uppercase tracking-wider">
              <span>● SISTEM KONTROL KONTEN</span>
              <span>/</span>
              <span>VOL. 01 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-[#38200B]">
              Manajemen & Kurasi Berita
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#38200B]/80 font-medium">
              Tambahkan berita baru, sesuaikan gambar sampul, edit isi cerita, dan atur status publikasi pembaca.
            </p>
          </div>

          <Link
            href="/admin/berita/tambah"
            className="self-start md:self-auto bg-[#BB240A] hover:bg-[#38200B] text-white px-6 py-3.5 rounded-xl font-mono font-extrabold text-xs sm:text-sm brutal-pill inline-flex items-center gap-2"
          >
            <span>➕ Tulis Berita Baru</span>
            <span>➔</span>
          </Link>
        </div>

        {/* Database Notice if disconnected in Netlify */}
        {!isDbConnected && (
          <div className="bg-[#EDCC4D]/25 border-[2.5px] border-[#BB240A] rounded-2xl p-5 shadow-[4px_4px_0px_#623F1B] space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-[#BB240A]">
              <span>⚠️</span>
              <span>CATATAN KONEKSI DATABASE CLOUD (NETLIFY)</span>
            </div>
            <p className="font-body text-xs sm:text-sm text-[#38200B] leading-relaxed">
              Panel admin saat ini berjalan menggunakan data lokal cadangan (safe fallback). Agar data artikel yang ditambah atau diedit tersimpan permanen di cloud database, pastikan Anda telah memasukkan variabel <strong>DATABASE_URL</strong> dan <strong>DIRECT_URL</strong> pada menu <em>Site configuration &gt; Environment variables</em> di dashboard Netlify.
            </p>
          </div>
        )}

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white border-[2.5px] border-[#623F1B] rounded-xl p-5 shadow-[4px_4px_0px_#623F1B]">
            <span className="font-mono text-[10px] font-bold text-[#623F1B] uppercase tracking-wider block">
              TOTAL BERITA ARSIP
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#38200B]">
                {totalArticles}
              </span>
              <span className="text-xl text-[#38200B]">📰</span>
            </div>
          </div>

          <div className="bg-white border-[2.5px] border-[#623F1B] rounded-xl p-5 shadow-[4px_4px_0px_#623F1B]">
            <span className="font-mono text-[10px] font-bold text-[#25D366] uppercase tracking-wider block">
              SUDAH TERBIT
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#2B5CB8]">
                {publishedArticles}
              </span>
              <span className="text-xs font-mono font-bold text-[#2B5CB8] bg-[#2B5CB8]/10 px-2 py-0.5 rounded border border-[#2B5CB8]/30">
                LIVE
              </span>
            </div>
          </div>

          <div className="bg-white border-[2.5px] border-[#623F1B] rounded-xl p-5 shadow-[4px_4px_0px_#623F1B]">
            <span className="font-mono text-[10px] font-bold text-[#BB240A] uppercase tracking-wider block">
              DRAF REDAKSI
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#BB240A]">
                {draftArticles}
              </span>
              <span className="text-xs font-mono font-bold text-[#BB240A] bg-[#BB240A]/10 px-2 py-0.5 rounded border border-[#BB240A]/30">
                PENDING
              </span>
            </div>
          </div>

          <div className="bg-white border-[2.5px] border-[#623F1B] rounded-xl p-5 shadow-[4px_4px_0px_#623F1B]">
            <span className="font-mono text-[10px] font-bold text-[#623F1B] uppercase tracking-wider block">
              TOTAL PEMBACA
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#38200B]">
                {totalViews.toLocaleString("id-ID")}
              </span>
              <span className="text-xl">👁</span>
            </div>
          </div>
        </div>

        {/* Interactive Article Table Component */}
        <AdminArticleTable initialArticles={articles} categories={categories} />
      </main>

      {/* Admin Footer */}
      <footer className="border-t-[2.5px] border-[#623F1B] bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-[#623F1B]">
            © {new Date().getFullYear()} WIS(UDAH) Panel Redaksi
          </div>
          <div className="bg-[#EDCC4D] border-[2px] border-[#623F1B] px-5 py-2 rounded-xl shadow-[3px_3px_0px_#623F1B] flex items-center gap-2">
            <span>✨</span>
            <span className="font-display font-extrabold text-xs sm:text-sm text-[#38200B]">
              KELOMPOK 2
            </span>
            <span>✨</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
