import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import ShareButtons from "@/components/ShareButtons";
import CommentsSection from "@/components/CommentsSection";
import SafeImage from "@/components/SafeImage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 10;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });

  if (!article) return { title: "Berita Tidak Ditemukan - WIS(UDAH)" };

  return {
    title: `${article.title} - WIS(UDAH)`,
    description: article.excerpt || "Kisah nyata perjalanan lulusan menuju dunia kerja.",
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Increment views and fetch article
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
      comments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!article || (!article.isPublished && process.env.NODE_ENV === "production")) {
    notFound();
  }

  // Auto-increment view count
  try {
    await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    });
  } catch (err) {
    // Non-blocking view increment
  }

  // Fetch related articles
  const relatedArticles = await prisma.article.findMany({
    where: {
      isPublished: true,
      NOT: { id: article.id },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Draf Redaksi";

  // Calculate approximate reading time
  const wordCount = article.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  // Paragraph formatting helper
  const paragraphs = article.content.split(/\n\n+/).filter((p) => p.trim());

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EE] text-[#38200B] selection:bg-[#EDCC4D] selection:text-[#38200B]">
      {/* 0. Top Checkerboard */}
      <div className="checkerboard-strip" />

      {/* 1. Global Navbar */}
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between text-xs font-mono font-bold text-[#623F1B] border-b-[2px] border-[#623F1B] pb-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#BB240A] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-[#BB240A] uppercase">{article.category.name}</span>
            <span>/</span>
            <span className="text-[#623F1B]/60 truncate max-w-[200px] sm:max-w-xs">
              {article.title}
            </span>
          </div>

          <Link
            href="/#cerita"
            className="hover:text-[#BB240A] flex items-center gap-1 transition-colors"
          >
            <span>← Kembali</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#BB240A] text-white px-3.5 py-1 rounded-full text-xs font-mono font-extrabold brutal-badge uppercase tracking-wider">
              {article.category.name}
            </span>
            {article.featured && (
              <span className="bg-[#EDCC4D] text-[#38200B] px-3 py-1 rounded-full text-xs font-mono font-extrabold brutal-badge">
                ★ PILIHAN REDAKSI
              </span>
            )}
            <span className="font-mono text-xs text-[#623F1B] font-bold">
              [EDISI KHUSUS 2026]
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.08] tracking-tight text-[#38200B]">
            {article.title}
          </h1>

          {/* Author & Publication Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border-[2px] border-[#623F1B] rounded-xl shadow-[3px_3px_0px_#623F1B]">
            <div className="flex items-center gap-3">
              {article.author.avatar ? (
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-[2px] border-[#623F1B]">
                  <SafeImage
                    src={article.author.avatar}
                    fallbackSrc="/images/berita/avatar-redaksi.jpg"
                    alt={article.author.name || "Penulis"}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#EDCC4D] border-[2px] border-[#623F1B] flex items-center justify-center font-mono font-bold text-sm text-[#38200B]">
                  W
                </div>
              )}

              <div>
                <div className="font-mono text-xs sm:text-sm font-extrabold text-[#38200B]">
                  {article.author.name || "Dewan Redaksi"}
                </div>
                <div className="font-mono text-[11px] text-[#623F1B]">
                  Redaksi WIS(UDAH) • Jurnalisme Transisi
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-[#623F1B]">
              <div className="flex items-center gap-1.5">
                <span>📅</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>⏱</span>
                <span>{readTime} menit baca</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>👁</span>
                <span>{article.views + 1} dibaca</span>
              </div>
            </div>
          </div>
        </header>

        {/* Excerpt Lead Box with Washi Tape */}
        {article.excerpt && (
          <div className="relative bg-[#EDCC4D]/25 border-[2.5px] border-[#623F1B] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#623F1B]">
            <div className="washi-tape-yellow" />
            <p className="font-display font-bold text-lg sm:text-xl text-[#38200B] leading-relaxed italic">
              &ldquo;{article.excerpt}&rdquo;
            </p>
          </div>
        )}

        {/* Cover Image Frame */}
        {article.coverImage && (
          <div className="space-y-2">
            <div className="relative w-full h-[320px] sm:h-[480px] rounded-2xl overflow-hidden border-[3px] border-[#623F1B] shadow-[6px_6px_0px_#623F1B]">
              <SafeImage
                src={article.coverImage}
                fallbackSrc="/images/cerita/cerita-01-makassar.jpg"
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
              <div className="absolute bottom-3 right-3 bg-[#38200B] text-[#EDCC4D] border border-[#623F1B] px-2.5 py-1 rounded text-[10px] font-mono font-extrabold brutal-badge">
                ARSIP FOTO RESMI
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#623F1B] px-1">
              <span>Dokumentasi visual transisi lulusan WIS(UDAH)</span>
              <span>DOK. REDAKSI</span>
            </div>
          </div>
        )}

        {/* Article Body Content */}
        <article className="prose prose-lg max-w-none space-y-6 font-body text-[#38200B] leading-relaxed text-base sm:text-lg">
          {paragraphs.map((p, idx) => {
            // Check if paragraph looks like a subheading (e.g. starts with ## or short title)
            if (p.startsWith("### ")) {
              return (
                <h3
                  key={idx}
                  className="text-xl sm:text-2xl font-extrabold font-display uppercase tracking-tight text-[#38200B] pt-4 border-b border-[#623F1B]/30 pb-2"
                >
                  {p.replace("### ", "")}
                </h3>
              );
            }
            if (p.startsWith("## ")) {
              return (
                <h2
                  key={idx}
                  className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-[#38200B] pt-6 border-b-[2px] border-[#623F1B] pb-2"
                >
                  {p.replace("## ", "")}
                </h2>
              );
            }
            if (p.startsWith("> ")) {
              return (
                <blockquote
                  key={idx}
                  className="border-l-4 border-[#BB240A] bg-white p-4 rounded-r-xl font-medium italic shadow-[2px_2px_0px_#623F1B]"
                >
                  {p.replace("> ", "")}
                </blockquote>
              );
            }

            return (
              <p key={idx} className="leading-relaxed">
                {p}
              </p>
            );
          })}
        </article>

        {/* Share & Editorial Box */}
        <div className="bg-white border-[2.5px] border-[#623F1B] rounded-2xl p-6 sm:p-8 shadow-[5px_5px_0px_#623F1B] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[2px] border-[#623F1B] pb-5">
            <div>
              <span className="font-mono text-xs font-bold text-[#BB240A] uppercase block">
                ZINE ARSIP WIS(UDAH)
              </span>
              <h4 className="font-display font-extrabold text-lg text-[#38200B]">
                Bantu sebarkan kisah ini kepada rekan sesama pencari kerja
              </h4>
            </div>

            <ShareButtons title={article.title} />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <div className="retro-stamp-round shrink-0">
              <span>WIS(UDAH)</span>
              <span className="text-[7px]">TERVERIFIKASI</span>
              <span>2026</span>
            </div>
            <p className="font-mono text-xs text-[#623F1B] leading-relaxed">
              Semua artikel di WIS(UDAH) diproduksi berdasarkan riset, data ketenagakerjaan, serta wawancara langsung dengan lulusan universitas untuk membangun ekosistem saling mendukung.
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <CommentsSection
          articleId={article.id}
          initialComments={article.comments.map((c) => ({
            id: c.id,
            content: c.content,
            guestName: c.guestName,
            createdAt: c.createdAt.toISOString(),
          }))}
        />

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="space-y-6 pt-8 border-t-[2.5px] border-[#623F1B]">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-[#38200B]">
                Cerita Terkait Lainnya
              </h3>
              <Link
                href="/#cerita"
                className="font-mono text-xs font-bold text-[#BB240A] hover:underline"
              >
                Lihat Semua ➔
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/berita/${rel.slug}`}
                  className="group bg-white border-[2px] border-[#623F1B] rounded-xl overflow-hidden shadow-[4px_4px_0px_#623F1B] hover:shadow-[6px_6px_0px_#623F1B] hover:-translate-y-1 transition-all flex flex-col"
                >
                  {rel.coverImage ? (
                    <div className="relative h-40 w-full overflow-hidden border-b-[2px] border-[#623F1B]">
                      <SafeImage
                        src={rel.coverImage}
                        fallbackSrc="/images/cerita/cerita-01-makassar.jpg"
                        alt={rel.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-full bg-[#E5DBD1] border-b-[2px] border-[#623F1B] flex items-center justify-center font-mono font-bold text-xs text-[#38200B]">
                      WIS(UDAH)
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <span className="font-mono text-[10px] font-extrabold text-[#BB240A] uppercase">
                      [{rel.category.name}]
                    </span>
                    <h4 className="font-display font-extrabold text-sm text-[#38200B] group-hover:text-[#BB240A] transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                    <span className="font-mono text-[11px] font-bold text-[#38200B] pt-2 flex items-center gap-1">
                      Baca Cerita ➔
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-[3px] border-[#623F1B] bg-white mt-16">
        <div className="checkerboard-strip" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#623F1B]">
          <div>WIS(UDAH) Media Siber &bull; {new Date().getFullYear()}</div>
          <Link href="/" className="hover:text-[#BB240A] font-bold">
            Kembali ke Beranda Utama ➔
          </Link>
        </div>
      </footer>
    </div>
  );
}
