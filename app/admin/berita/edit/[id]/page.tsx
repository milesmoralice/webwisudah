import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ArticleEditorForm from "@/components/ArticleEditorForm";
import LogoutButton from "@/components/LogoutButton";
import { isAuthenticated } from "@/lib/auth";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

const FALLBACK_CATEGORIES = [
  { id: "cat-1", name: "Cerita Lulusan", slug: "cerita-lulusan" },
  { id: "cat-2", name: "Dunia Kerja", slug: "dunia-kerja" },
  { id: "cat-3", name: "Data & Temuan", slug: "data-temuan" },
  { id: "cat-4", name: "Perspektif", slug: "perspektif" },
  { id: "cat-5", name: "Kontribusi", slug: "kontribusi" },
];

export default async function EditBeritaPage({ params }: EditPageProps) {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const { id } = await params;

  let article: any = null;
  let categories: any[] = FALLBACK_CATEGORIES;

  try {
    const [dbArticle, dbCategories] = await Promise.all([
      prisma.article.findUnique({
        where: { id },
        include: { category: true },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);
    if (dbArticle) article = dbArticle;
    if (dbCategories && dbCategories.length > 0) categories = dbCategories;
  } catch (err) {
    console.error("Prisma query failed in edit page:", err);
  }

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#38200B] flex flex-col selection:bg-[#EDCC4D] selection:text-[#38200B]">
      {/* Retro Ribbon */}
      <div className="checkerboard-strip" />

      {/* Admin Nav */}
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
              href={`/berita/${article.slug}`}
              target="_blank"
              className="px-3.5 py-1.5 rounded-lg bg-[#EDCC4D] hover:bg-white text-[#38200B] border border-[#623F1B] brutal-badge transition-colors"
            >
              👁 Pratinjau Publik
            </Link>
            <Link
              href="/admin"
              className="px-3.5 py-1.5 rounded-lg bg-[#E5DBD1] hover:bg-[#EDCC4D] text-[#38200B] border border-[#623F1B] brutal-badge transition-colors"
            >
              ← Kembali ke Dashboard
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Breadcrumbs & Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#623F1B]">
            <Link href="/admin" className="hover:text-[#BB240A]">
              DASHBOARD
            </Link>
            <span>/</span>
            <span className="text-[#BB240A]">EDIT CERITA</span>
            <span>/</span>
            <span className="truncate max-w-xs">{article.title}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-[#38200B]">
            Kustomisasi & Perbarui Cerita
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#623F1B]">
            Ubah judul, ganti gambar sampul, sesuaikan isi narasi, atau perbarui status penayangan cerita lulusan ini.
          </p>
        </div>

        {/* Form Pre-filled */}
        <ArticleEditorForm
          mode="edit"
          initialData={{
            id: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt || "",
            content: article.content,
            coverImage: article.coverImage,
            categoryId: article.categoryId,
            isPublished: article.isPublished,
            featured: article.featured,
          }}
          categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        />
      </main>

      {/* Admin Footer */}
      <footer className="border-t-[2.5px] border-[#623F1B] bg-white py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
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
