import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AllArticlesSection from "@/components/AllArticlesSection";
import SafeImage from "@/components/SafeImage";

export const revalidate = 60;

const FALLBACK_CATEGORIES = [
  { id: "cat-1", name: "Cerita Lulusan", slug: "cerita-lulusan", description: null, createdAt: new Date(), updatedAt: new Date(), _count: { articles: 2 } },
  { id: "cat-2", name: "Dunia Kerja", slug: "dunia-kerja", description: null, createdAt: new Date(), updatedAt: new Date(), _count: { articles: 1 } },
  { id: "cat-3", name: "Data & Temuan", slug: "data-temuan", description: null, createdAt: new Date(), updatedAt: new Date(), _count: { articles: 1 } },
  { id: "cat-4", name: "Perspektif", slug: "perspektif", description: null, createdAt: new Date(), updatedAt: new Date(), _count: { articles: 1 } },
  { id: "cat-5", name: "Kontribusi", slug: "kontribusi", description: null, createdAt: new Date(), updatedAt: new Date(), _count: { articles: 0 } },
];

const FALLBACK_ARTICLES = [
  {
    id: "art-1",
    title: "Menavigasi 100 Hari Pertama Pasca Wisuda: Dari Euforia Toga Menuju Realitas Mencari Arah",
    slug: "menavigasi-100-hari-pertama-pasca-wisuda",
    excerpt: "Membaca perjalanan lulusan menuju dunia kerja. Menelusuri cerita setelah wisuda—dari langkah pertama, pencarian kerja, sampai menemukan ruang untuk bertumbuh.",
    content: "Momen wisuda kerap dirayakan sebagai puncak pencapaian akademik. Namun bagi banyak sarjana baru, hari-hari setelah melepas toga justru menjadi awal dari babak paling menantang: transisi menuju dunia profesional.",
    coverImage: "/images/cerita/cerita-01-makassar.jpg",
    isPublished: true,
    publishedAt: new Date(),
    featured: true,
    views: 1420,
    authorId: "author-1",
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Cerita Lulusan", slug: "cerita-lulusan" },
    author: { id: "author-1", name: "Redaksi WIS(UDAH)", email: "redaksi@wisudah.id", avatar: null, role: "ADMIN" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "art-2",
    title: "Seni Menghadapi Wawancara Kerja: Cerita Lulusan Pertama yang Menembus Industri Kreatif",
    slug: "seni-menghadapi-wawancara-kerja-industri-kreatif",
    excerpt: "Pengalaman nyata menyusun portofolio relevan dan membangun kepercayaan diri saat bersaing dengan ratusan kandidat.",
    content: "Menghadapi meja wawancara sering kali terasa intimidatif. Lewat ketekunan mengasah studi kasus nyata dan komunikasi lugas, lulusan ini membuktikan bahwa latar belakang kampus daerah mampu bersaing di ibu kota.",
    coverImage: "/images/cerita/cerita-02-hr.jpg",
    isPublished: true,
    publishedAt: new Date(),
    featured: false,
    views: 980,
    authorId: "author-1",
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Cerita Lulusan", slug: "cerita-lulusan" },
    author: { id: "author-1", name: "Redaksi WIS(UDAH)", email: "redaksi@wisudah.id", avatar: null, role: "ADMIN" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "art-3",
    title: "Gap Year Produktif: Mengubah Masa Tunggu Kerja Menjadi Laboratorium Eksplorasi Diri",
    slug: "gap-year-produktif-eksplorasi-diri",
    excerpt: "Mengapa tidak langsung bekerja bukan berarti tertinggal, melainkan kesempatan memperdalam kompetensi digital.",
    content: "Banyak sarjana merasa cemas ketika tawaran kerja tak kunjung tiba dalam 3 bulan pertama. Mengambil inisiatif proyek mandiri atau magang terarah terbukti menjadi pembeda signifikan di mata perekrut.",
    coverImage: "/images/cerita/cerita-03-dream-job.jpg",
    isPublished: true,
    publishedAt: new Date(),
    featured: false,
    views: 750,
    authorId: "author-1",
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Dunia Kerja", slug: "dunia-kerja" },
    author: { id: "author-1", name: "Redaksi WIS(UDAH)", email: "redaksi@wisudah.id", avatar: null, role: "ADMIN" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "art-4",
    title: "Data Pengangguran Lulusan Perguruan Tinggi: Analisis Tren Nasional dan Potensi Daerah",
    slug: "data-pengangguran-lulusan-nasional-dan-daerah",
    excerpt: "Membaca angka ketenagakerjaan dari Makassar hingga kota-kota besar untuk memetakan mismatch keahlian lulusan.",
    content: "Berdasarkan data statistik terbaru, tantangan utama bukanlah ketiadaan lowongan, melainkan ketidaksesuaian antara kurikulum perguruan tinggi dengan ekspektasi teknis industri modern.",
    coverImage: "/images/berita/berita-04.jpg",
    isPublished: true,
    publishedAt: new Date(),
    featured: false,
    views: 1120,
    authorId: "author-1",
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Data & Temuan", slug: "data-temuan" },
    author: { id: "author-1", name: "Redaksi WIS(UDAH)", email: "redaksi@wisudah.id", avatar: null, role: "ADMIN" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "art-5",
    title: "Kompetensi Industri 2026: Keahlian Praktis yang Dicari Perusahaan di Era Otomatisasi",
    slug: "kompetensi-industri-keahlian-praktis-era-otomatisasi",
    excerpt: "Kemampuan analisis kritis, adaptasi AI kontekstual, dan kolaborasi lintas tim menjadi standar emas baru.",
    content: "Perusahaan modern kian memprioritaskan kecakapan problem-solving nyata dibandingkan sekadar indeks prestasi kumulatif (IPK).",
    coverImage: "/images/berita/berita-05.jpg",
    isPublished: true,
    publishedAt: new Date(),
    featured: false,
    views: 890,
    authorId: "author-1",
    categoryId: "cat-4",
    category: { id: "cat-4", name: "Perspektif", slug: "perspektif" },
    author: { id: "author-1", name: "Redaksi WIS(UDAH)", email: "redaksi@wisudah.id", avatar: null, role: "ADMIN" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default async function HomePage() {
  let categories: any[] = FALLBACK_CATEGORIES;
  let articles: any[] = FALLBACK_ARTICLES;

  try {
    const [dbCategories, dbArticles] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { articles: true },
          },
        },
      }),
      prisma.article.findMany({
        where: { isPublished: true },
        include: {
          category: true,
          author: true,
        },
        orderBy: { publishedAt: "desc" },
      }),
    ]);

    if (dbCategories && dbCategories.length > 0) {
      categories = dbCategories;
    }
    if (dbArticles && dbArticles.length > 0) {
      articles = dbArticles;
    }
  } catch (error) {
    console.error("Prisma fetch failed, using fallback articles:", error);
  }

  const heroArticle = articles.find((a) => a.featured) || articles[0];
  const stories = articles.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EE] text-[#38200B] overflow-x-hidden selection:bg-[#EDCC4D] selection:text-[#38200B]">
      {/* 0. RETRO CHECKERBOARD RIBBON */}
      <div className="checkerboard-strip" />

      {/* 1. TOP NAVBAR (Interactive with Search Modal & Direct Admin Link) */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-16">
        {/* 2. GIANT HERO SECTION (Nyentrik Neo-Brutalist with Dual Shadow & Stamps) */}
        <section className="relative bg-[#BB240A] text-white rounded-3xl p-8 sm:p-12 lg:p-16 border-[3px] border-[#623F1B] shadow-[6px_6px_0px_#623F1B,12px_12px_0px_#EDCC4D] overflow-hidden">
          {/* Quirky Starburst Floating Tag */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-[#EDCC4D] text-[#38200B] border-[2px] border-[#623F1B] px-3 py-1 rounded-md text-[11px] font-mono font-extrabold brutal-badge transform rotate-3 hidden sm:flex items-center gap-1.5 z-20">
            <span>★</span>
            <span>EDISI RESMI TERVERIFIKASI</span>
            <span>★</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase bg-[#38200B] text-[#EDCC4D] px-3.5 py-1 rounded-full border border-[#623F1B] shadow-[2px_2px_0px_#623F1B]">
                <span>WIS(UDAH)</span>
                <span>/</span>
                <span>TRANSISI LULUSAN</span>
                <span className="text-[10px] text-white">#0928</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display leading-[1.05] tracking-tight text-white">
                Membaca perjalanan{" "}
                <span className="relative inline-block mx-1">
                  <span className="bg-[#EDCC4D] text-[#38200B] px-3.5 py-1 rounded-xl inline-block transform -rotate-1 border-[2.5px] border-[#623F1B] shadow-[4px_4px_0px_#623F1B]">
                    lulusan
                  </span>
                </span>{" "}
                menuju dunia kerja.
              </h1>

              <p className="text-base sm:text-lg text-white/95 font-body leading-relaxed max-w-xl font-medium">
                Menelusuri cerita setelah wisuda— dari langkah pertama, pencarian kerja, sampai menemukan ruang untuk bertumbuh.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  href="#cerita"
                  className="bg-[#38200B] hover:bg-black text-[#EDCC4D] px-8 py-4 rounded-full font-mono font-extrabold text-xs sm:text-sm brutal-pill inline-flex items-center gap-2.5"
                >
                  <span>Mulai membaca</span>
                  <span className="text-lg leading-none">➔</span>
                </Link>
                <Link
                  href="#tentang"
                  className="bg-white hover:bg-[#F7F3EE] text-[#38200B] px-8 py-4 rounded-full font-mono font-extrabold text-xs sm:text-sm brutal-pill"
                >
                  Tentang WIS(UDAH)
                </Link>
              </div>
            </div>

            {/* Right Column: Booklet "AFTER GRADUATION" + Stamp + Washi Tape */}
            <div className="lg:col-span-5 flex items-center justify-center relative min-h-[340px]">
              {/* Abstract Yellow Sun Circle with Bold Outline */}
              <div className="w-64 h-64 sm:w-76 sm:h-76 rounded-full bg-[#EDCC4D] border-[3px] border-[#623F1B] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[5px_5px_0px_#623F1B]" />

              {/* Abstract Deep Blue Shape */}
              <div className="w-36 h-48 rounded-t-full bg-[#2B5CB8] border-[2.5px] border-[#623F1B] absolute bottom-2 right-4 sm:right-8 z-0 rotate-12 shadow-[3px_3px_0px_#623F1B]" />

              {/* Tilted Booklet "AFTER GRADUATION" */}
              <div className="relative z-10 w-64 sm:w-72 bg-[#F7F3EE] text-[#38200B] rounded-2xl p-6 sm:p-8 border-[3px] border-[#623F1B] shadow-[7px_7px_0px_#623F1B] transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
                {/* Washi Tape Accent */}
                <div className="washi-tape-yellow" />
                <div className="washi-tape-red" />

                <div className="space-y-6 pt-3">
                  <div className="border-b-[2.5px] border-[#623F1B] pb-3">
                    <span className="text-[10px] font-mono font-bold text-[#BB240A] tracking-widest uppercase block mb-1">
                      [ZINE ARSIP]
                    </span>
                    <div className="font-display font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#38200B] leading-none">
                      AFTER<br />GRADUATION
                    </div>
                  </div>

                  <p className="font-mono text-[10px] text-[#623F1B] leading-relaxed">
                    Dokumentasi kisah nyata lulusan universitas menghadapi dinamika dunia kerja nyata.
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    {/* Circular Stamp */}
                    <div className="retro-stamp-round">
                      <span>WIS(UDAH)</span>
                      <span className="text-[7px]">TERVERIFIKASI</span>
                      <span>2026</span>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-2xl text-[#BB240A] font-extrabold">↗</div>
                      <span className="text-[8px] text-[#623F1B]">NO: 0928</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. NUMBERED CATEGORY SUBNAV (Retro Ticket / Archival Strip) */}
        <nav className="border-[2.5px] border-[#623F1B] bg-white rounded-2xl p-4 shadow-[4px_4px_0px_#623F1B]">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs sm:text-sm font-bold text-[#38200B]">
            {categories.slice(0, 5).map((cat, idx) => {
              const num = `0${idx + 1}`;
              return (
                <Link
                  key={cat.id}
                  href={`#${cat.slug}`}
                  className="flex items-center gap-2 group hover:text-[#BB240A] px-3 py-1.5 rounded-lg hover:bg-[#EDCC4D]/30 transition-all"
                >
                  <span className="bg-[#BB240A] text-white px-2 py-0.5 rounded text-[11px] font-mono font-extrabold brutal-badge group-hover:scale-110 transition-transform">
                    {num}
                  </span>
                  <span className="group-hover:underline underline-offset-4 decoration-2 decoration-[#BB240A] uppercase tracking-wide">
                    {cat.name}
                  </span>
                  {idx < 4 && <span className="hidden lg:inline text-[#623F1B]/40 ml-2">/</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* 4. SUB-HERO MANIFESTO + STICKY POST-IT MEMO */}
        <section id="tentang" className="space-y-4 pt-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-extrabold text-[#BB240A] tracking-wider uppercase bg-[#BB240A]/10 px-3 py-1 rounded-full border border-[#BB240A]/30">
              RUANG BACA WIS(UDAH)
            </span>
            <span className="retro-stamp-slanted">ARSIP TERBUKA</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <h2 className="lg:col-span-7 text-4xl sm:text-6xl font-extrabold font-display leading-[1.05] tracking-tight text-[#38200B]">
              Setiap lulusan punya{" "}
              <span className="text-[#BB240A] underline decoration-4 decoration-[#EDCC4D] underline-offset-4">
                cerita.
              </span>
            </h2>

            {/* Pinned Post-it Note */}
            <div className="lg:col-span-5 bg-[#EDCC4D] border-[2.5px] border-[#623F1B] rounded-xl p-5 shadow-[4px_4px_0px_#623F1B] transform rotate-1 relative">
              <div className="text-center font-mono text-base mb-1">📌</div>
              <p className="font-body text-xs sm:text-sm text-[#38200B] font-semibold leading-relaxed">
                WIS(UDAH) adalah ruang untuk memahami perjalanan lulusan setelah kampus: keputusan yang diambil, peluang yang dicari, tantangan yang dihadapi, dan pengalaman yang membentuk langkah menuju dunia kerja.
              </p>
              <div className="mt-3 text-right font-mono text-[10px] font-extrabold text-[#623F1B] uppercase tracking-wider">
                — DEWAN REDAKSI WIS(UDAH)
              </div>
            </div>
          </div>
        </section>

        {/* 5. CERITA PILIHAN (3 Image Cards 01, 02, 03 with Badges & Paperclips) */}
        <section id="cerita" className="space-y-6">
          <div className="flex items-center justify-between border-b-[2.5px] border-[#623F1B] pb-3">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-[#38200B]">
                Cerita pilihan
              </h3>
              <span className="bg-[#EDCC4D] text-[#38200B] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#623F1B]">
                KABAR TERVERIFIKASI
              </span>
            </div>

            <Link
              href="#semua"
              className="font-mono text-xs sm:text-sm font-bold text-[#38200B] hover:text-[#BB240A] flex items-center gap-1.5 transition-colors"
            >
              <span>Lihat semua</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {stories.map((article, idx) => {
              const num = `0${idx + 1}`;
              const badgeLabels = ["★ CERITA UTAMA", "⚡ PENGALAMAN", "👁 PERSPEKTIF"];
              const currentBadge = badgeLabels[idx] || "KABAR";
              const storyImages = [
                "/images/cerita/cerita-01-makassar.jpg",
                "/images/cerita/cerita-02-hr.jpg",
                "/images/cerita/cerita-03-dream-job.jpg",
              ];
              const cardImage = storyImages[idx] || article.coverImage;

              return (
                <Link
                  key={article.id}
                  href={`/berita/${article.slug}`}
                  className="group relative rounded-2xl overflow-hidden border-[3px] border-[#623F1B] shadow-[5px_5px_0px_#623F1B] hover:shadow-[8px_8px_0px_#623F1B] hover:-translate-y-1.5 transition-all duration-200 bg-zinc-900 min-h-[360px] flex flex-col justify-between p-6 block cursor-pointer"
                >
                  {/* Photo Background */}
                  {cardImage && (
                    <SafeImage
                      src={cardImage}
                      alt={article.title}
                      fill
                      className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500 -z-0"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent -z-0 pointer-events-none" />

                  {/* Card Top: Quirky Badge on Left, Big Number on Right */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-white text-[#38200B] px-3.5 py-1 rounded-full text-[11px] font-mono font-extrabold brutal-badge tracking-wider">
                      {currentBadge}
                    </span>
                    <span className="text-4xl font-extrabold font-mono text-[#EDCC4D] drop-shadow-[2px_2px_0px_#38200B]">
                      {num}
                    </span>
                  </div>

                  {/* Card Bottom: Metadata, Title & Excerpt */}
                  <div className="relative z-10 space-y-2.5 pt-20">
                    <span className="text-[11px] font-mono text-[#EDCC4D] font-bold uppercase tracking-wider block">
                      [{article.category.name}]
                    </span>
                    <h4 className="text-xl sm:text-2xl font-extrabold font-display uppercase text-white group-hover:text-[#EDCC4D] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-xs text-white/85 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="pt-2 flex items-center text-xs font-mono font-bold text-[#EDCC4D] gap-1 group-hover:translate-x-1 transition-transform">
                      <span>BACA SELENGKAPNYA</span>
                      <span>➔</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 6. MIDDLE FEATURE BANNER ("WIS(UDAH) / FEATURE") */}
        <section className="relative rounded-3xl overflow-hidden border-[3px] border-[#623F1B] shadow-[6px_6px_0px_#623F1B,10px_10px_0px_#2B5CB8] min-h-[380px] sm:min-h-[440px] flex items-center p-8 sm:p-14">
          <SafeImage
            src="/images/berita/feature-banner.jpg"
            alt="Perjalanan karier lulusan"
            fill
            className="object-cover -z-0"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/65 -z-0" />

          {/* Content */}
          <div className="relative z-10 max-w-2xl space-y-6 text-white">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-wider bg-white/20 px-3.5 py-1 rounded-full border border-white/30 backdrop-blur-sm font-bold">
                WIS(UDAH) / FEATURE
              </span>
              <span className="retro-stamp-slanted bg-white/90 text-xs">
                RUANG REFLEKSI
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.08] tracking-tight">
              Perjalanan tidak selalu{" "}
              <span className="bg-[#EDCC4D] text-[#38200B] px-3 py-0.5 rounded-lg inline-block transform rotate-1 border-2 border-[#623F1B]">
                lurus.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-white/95 font-body leading-relaxed max-w-lg font-medium">
              Setiap rintangan, penolakan, dan peralihan arah adalah bagian integral dari proses pembentukan profesional yang tangguh.
            </p>

            <div className="pt-2">
              <Link
                href="#temuan"
                className="bg-white hover:bg-[#EDCC4D] text-[#38200B] px-8 py-4 rounded-full font-mono font-extrabold text-xs sm:text-sm brutal-pill inline-flex items-center gap-2"
              >
                <span>Jelajahi temuan</span>
                <span className="text-base leading-none">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 7. DATA & TEMUAN SECTION (3 Solid Color Cards with Perforation Line) */}
        <section id="temuan" className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-extrabold text-[#BB240A] tracking-wider uppercase bg-[#BB240A]/10 px-3 py-1 rounded-full border border-[#BB240A]/30">
                DATA & TEMUAN
              </span>
              <span className="font-mono text-xs text-[#623F1B] font-bold">
                [STATISTIK KETENAGAKERJAAN 2026]
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <h3 className="lg:col-span-7 text-3xl sm:text-5xl font-extrabold font-display leading-[1.05] tracking-tight text-[#38200B]">
                Membaca angka,{" "}
                <span className="text-[#BB240A] underline decoration-4 decoration-[#EDCC4D] underline-offset-4">
                  Mencari Potensi.
                </span>
              </h3>

              <p className="lg:col-span-5 text-sm sm:text-base text-[#623F1B] font-body font-medium leading-relaxed pt-1">
                Beberapa potongan yang membantu melihat masa transisi lulusan dari perspektif yang lebih luas.
              </p>
            </div>
          </div>

          {/* 3 Solid Color Cards (Vermelho, Areia Clara, Azul) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 01: Vermelho Vívido */}
            <Link
              href="/berita/data-pengangguran-lulusan-nasional-dan-daerah"
              className="bg-[#BB240A] text-white rounded-3xl p-8 border-[3px] border-[#623F1B] shadow-[5px_5px_0px_#623F1B] hover:shadow-[8px_8px_0px_#623F1B] hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between min-h-[320px] relative overflow-hidden block cursor-pointer group"
            >
              <div className="flex items-center justify-between font-mono text-xs font-extrabold tracking-wider uppercase">
                <span className="bg-black/20 px-2.5 py-0.5 rounded border border-white/20">01 / TRANSISI</span>
                <span>✂ - - -</span>
              </div>
              <div className="space-y-3 my-6">
                <span className="text-6xl sm:text-7xl font-extrabold font-mono text-white leading-none block drop-shadow-[3px_3px_0px_#38200B]">
                  01
                </span>
                <h4 className="text-2xl sm:text-3xl font-extrabold font-display leading-snug group-hover:text-[#EDCC4D] transition-colors">
                  Data Pengangguran Makassar dan Nasional
                </h4>
              </div>
              <div className="pt-4 border-t-2 border-dashed border-white/30 flex items-center justify-between text-xs font-mono font-bold">
                <span>Riset BPS & Ketenagakerjaan</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">➔</span>
              </div>
            </Link>

            {/* Card 02: Areia Clara */}
            <Link
              href="/berita/seni-menghadapi-wawancara-kerja-industri-kreatif"
              className="bg-[#E5DBD1] text-[#38200B] rounded-3xl p-8 border-[3px] border-[#623F1B] shadow-[5px_5px_0px_#623F1B] hover:shadow-[8px_8px_0px_#623F1B] hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between min-h-[320px] relative overflow-hidden block cursor-pointer group"
            >
              <div className="flex items-center justify-between font-mono text-xs font-extrabold tracking-wider uppercase">
                <span className="bg-[#623F1B]/10 px-2.5 py-0.5 rounded border border-[#623F1B]/30">02 / ADAPTASI</span>
                <span>✂ - - -</span>
              </div>
              <div className="space-y-3 my-6">
                <span className="text-6xl sm:text-7xl font-extrabold font-mono text-[#38200B] leading-none block drop-shadow-[3px_3px_0px_#EDCC4D]">
                  02
                </span>
                <h4 className="text-2xl sm:text-3xl font-extrabold font-display leading-snug text-[#38200B] group-hover:text-[#BB240A] transition-colors">
                  Seni Menghadapi Wawancara Kerja
                </h4>
              </div>
              <div className="pt-4 border-t-2 border-dashed border-[#623F1B]/30 flex items-center justify-between text-xs font-mono font-bold text-[#623F1B]">
                <span>Strategi Menembus Rekrutmen</span>
                <span className="text-xl text-[#38200B] group-hover:translate-x-1 transition-transform">➔</span>
              </div>
            </Link>

            {/* Card 03: Azul Deep */}
            <Link
              href="/berita/kompetensi-industri-keahlian-praktis-era-otomatisasi"
              className="bg-[#2B5CB8] text-white rounded-3xl p-8 border-[3px] border-[#623F1B] shadow-[5px_5px_0px_#623F1B] hover:shadow-[8px_8px_0px_#623F1B] hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between min-h-[320px] relative overflow-hidden block cursor-pointer group"
            >
              <div className="flex items-center justify-between font-mono text-xs font-extrabold tracking-wider uppercase">
                <span className="bg-black/20 px-2.5 py-0.5 rounded border border-white/20">03 / ARAH</span>
                <span>✂ - - -</span>
              </div>
              <div className="space-y-3 my-6">
                <span className="text-6xl sm:text-7xl font-extrabold font-mono text-white leading-none block drop-shadow-[3px_3px_0px_#38200B]">
                  03
                </span>
                <h4 className="text-2xl sm:text-3xl font-extrabold font-display leading-snug group-hover:text-[#EDCC4D] transition-colors">
                  Kompetensi Industri 2026
                </h4>
              </div>
              <div className="pt-4 border-t-2 border-dashed border-white/30 flex items-center justify-between text-xs font-mono font-bold">
                <span>Kebutuhan Keterampilan Baru</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">➔</span>
              </div>
            </Link>
          </div>
        </section>

        {/* 7.5 KATALOG LENGKAP SEMUA BERITA (Filterable by Category) */}
        <AllArticlesSection articles={articles} categories={categories} />
      </main>

      {/* 8. FOOTER WITH RETRO CHECKERBOARD & BARCODE */}
      <footer id="kontak" className="border-t-[3px] border-[#623F1B] bg-white mt-16">
        <div className="checkerboard-strip" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-[#38200B]">
              WIS<span className="text-[#BB240A] font-mono">(</span>UDAH<span className="text-[#BB240A] font-mono">)</span>
            </h2>
            <p className="text-xs font-mono text-[#623F1B]">
              © {new Date().getFullYear()} WIS(UDAH) Media Siber. Ruang baca perjalanan lulusan menuju dunia kerja.
            </p>
            <div className="text-[11px] font-mono text-[#BB240A] font-extrabold">
              [DIPRODUKSI DENGAN KEPALA DINGIN & ROASTED OOLONG MILKTEA]
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="bg-[#EDCC4D] border-[2.5px] border-[#623F1B] px-6 py-2.5 rounded-2xl shadow-[4px_4px_0px_#623F1B] flex items-center gap-2 transform rotate-1 hover:rotate-0 transition-transform">
              <span className="text-base">✨</span>
              <span className="font-display font-extrabold text-sm sm:text-base tracking-wide text-[#38200B]">
                KELOMPOK 2
              </span>
              <span className="text-base">✨</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
