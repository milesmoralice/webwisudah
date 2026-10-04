const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding WIS(UDAH) news and career transition data...');

  // 1. Author
  const author = await prisma.user.upsert({
    where: { email: 'redaksi@wisudah.id' },
    update: {},
    create: {
      name: 'Redaksi WIS(UDAH)',
      email: 'redaksi@wisudah.id',
      avatar: '/images/berita/avatar-redaksi.jpg',
      role: 'ADMIN',
    },
  });

  // 2. Categories tailored to WIS(UDAH)
  const categoriesData = [
    { name: 'Cerita Lulusan', slug: 'cerita-lulusan', description: 'Kisah nyata perjalanan fresh graduate setelah wisuda.' },
    { name: 'Dunia Kerja', slug: 'dunia-kerja', description: 'Dinamika karier, rekrutmen, dan adaptasi di tempat kerja.' },
    { name: 'Data & Temuan', slug: 'data-temuan', description: 'Riset, statistik ketenagakerjaan, dan analisis peluang.' },
    { name: 'Perspektif', slug: 'perspektif', description: 'Opini mendalam dan refleksi masa transisi pasca kampus.' },
    { name: 'Kontribusi', slug: 'kontribusi', description: 'Inisiatif alumni dan aksi nyata untuk masyarakat.' },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }

  // 3. Articles
  const articlesData = [
    {
      title: 'Menavigasi 100 Hari Pertama Pasca Wisuda: Dari Euforia Toga Menuju Realitas Mencari Arah',
      slug: 'menavigasi-100-hari-pertama-pasca-wisuda',
      excerpt: 'Membaca perjalanan lulusan menuju dunia kerja. Menelusuri cerita setelah wisuda—dari langkah pertama, pencarian kerja, sampai menemukan ruang untuk bertumbuh.',
      content: 'Momen wisuda kerap dirayakan sebagai puncak pencapaian akademik. Namun bagi banyak sarjana baru, hari-hari setelah melepas toga justru menjadi awal dari babak paling menantang: transisi menuju dunia profesional...',
      coverImage: '/images/cerita/cerita-01-makassar.jpg',
      featured: true,
      isPublished: true,
      publishedAt: new Date(),
      views: 1420,
      authorId: author.id,
      categoryId: categories['cerita-lulusan'].id,
    },
    {
      title: 'Seni Menghadapi Wawancara Kerja: Cerita Lulusan Pertama yang Menembus Industri Kreatif',
      slug: 'seni-menghadapi-wawancara-kerja-industri-kreatif',
      excerpt: 'Pengalaman nyata menyusun portofolio relevan dan membangun kepercayaan diri saat bersaing dengan ratusan kandidat.',
      content: 'Menghadapi meja wawancara sering kali terasa intimidatif. Lewat ketekunan mengasah studi kasus nyata dan komunikasi lugas, lulusan ini membuktikan bahwa latar belakang kampus daerah mampu bersaing di ibu kota.',
      coverImage: '/images/cerita/cerita-02-hr.jpg',
      featured: false,
      isPublished: true,
      publishedAt: new Date(Date.now() - 3600000 * 2),
      views: 980,
      authorId: author.id,
      categoryId: categories['cerita-lulusan'].id,
    },
    {
      title: 'Gap Year Produktif: Mengubah Masa Tunggu Kerja Menjadi Laboratorium Eksplorasi Diri',
      slug: 'gap-year-produktif-eksplorasi-diri',
      excerpt: 'Mengapa tidak langsung bekerja bukan berarti tertinggal, melainkan kesempatan memperdalam kompetensi digital.',
      content: 'Banyak sarjana merasa cemas ketika tawaran kerja tak kunjung tiba dalam 3 bulan pertama. Mengambil inisiatif proyek mandiri atau magang terarah terbukti menjadi pembeda signifikan di mata perekrut.',
      coverImage: '/images/cerita/cerita-03-dream-job.jpg',
      featured: false,
      isPublished: true,
      publishedAt: new Date(Date.now() - 3600000 * 5),
      views: 750,
      authorId: author.id,
      categoryId: categories['dunia-kerja'].id,
    },
    {
      title: 'Data Pengangguran Lulusan Perguruan Tinggi: Analisis Tren Nasional dan Potensi Daerah',
      slug: 'data-pengangguran-lulusan-nasional-dan-daerah',
      excerpt: 'Membaca angka ketenagakerjaan dari Makassar hingga kota-kota besar untuk memetakan mismatch keahlian lulusan.',
      content: 'Berdasarkan data statistik terbaru, tantangan utama bukanlah ketiadaan lowongan, melainkan ketidaksesuaian antara kurikulum perguruan tinggi dengan ekspektasi teknis industri modern.',
      coverImage: '/images/berita/berita-04.jpg',
      featured: false,
      isPublished: true,
      publishedAt: new Date(Date.now() - 3600000 * 9),
      views: 1120,
      authorId: author.id,
      categoryId: categories['data-temuan'].id,
    },
    {
      title: 'Kompetensi Industri 2026: Keahlian Praktis yang Dicari Perusahaan di Era Otomatisasi',
      slug: 'kompetensi-industri-keahlian-praktis-era-otomatisasi',
      excerpt: 'Kemampuan analisis kritis, adaptasi AI kontekstual, dan kolaborasi lintas tim menjadi standar emas baru.',
      content: 'Perusahaan modern kian memprioritaskan kecakapan problem-solving nyata dibandingkan sekadar indeks prestasi kumulatif (IPK). Simak breakdown kompetensi kunci yang perlu dipersiapkan.',
      coverImage: '/images/berita/berita-05.jpg',
      featured: false,
      isPublished: true,
      publishedAt: new Date(Date.now() - 3600000 * 14),
      views: 890,
      authorId: author.id,
      categoryId: categories['perspektif'].id,
    },
  ];

  for (const item of articlesData) {
    await prisma.article.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  console.log('Seeding WIS(UDAH) data finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
