"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SafeImage from "@/components/SafeImage";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ArticleEditorFormProps {
  mode: "create" | "edit";
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    categoryId: string;
    isPublished: boolean;
    featured: boolean;
  };
  categories: CategoryOption[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ArticleEditorForm({
  mode,
  initialData,
  categories,
}: ArticleEditorFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManual, setIsSlugManual] = useState(mode === "edit");
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || categories[0]?.id || ""
  );
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState<string>(initialData?.coverImage || "");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [featured, setFeatured] = useState(initialData?.featured ?? false);

  // Image tab: "upload" | "url" | "presets"
  const [imageTab, setImageTab] = useState<"upload" | "url" | "presets">("upload");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Content tab: "editor" | "preview"
  const [contentTab, setContentTab] = useState<"editor" | "preview">("editor");

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto generate slug when title changes unless manually customized
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
  };

  // Upload handler
  const handleFileUpload = async (file: File) => {
    setUploadingImage(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setCoverImage(data.url);
      } else {
        setUploadError(data.error || "Gagal mengunggah gambar");
      }
    } catch (err: any) {
      setUploadError("Terjadi kendala saat upload gambar");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Content formatting toolbar helpers
  const insertFormatting = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const currentVal = textareaRef.current.value;
    const selectedText = currentVal.substring(start, end);
    const replacement = prefix + (selectedText || "teks") + suffix;

    const newVal =
      currentVal.substring(0, start) + replacement + currentVal.substring(end);

    setContent(newVal);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = start + prefix.length;
        textareaRef.current.selectionEnd =
          start + prefix.length + (selectedText ? selectedText.length : 4);
      }
    }, 10);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim() || !content.trim() || !categoryId) {
      setErrorMessage("Judul, kategori, dan isi berita wajib diisi.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        title,
        slug: slug || slugify(title),
        categoryId,
        excerpt: excerpt || title.slice(0, 150),
        content,
        coverImage: coverImage || null,
        isPublished,
        featured,
      };

      const url =
        mode === "create" ? "/api/articles" : `/api/articles/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(
          mode === "create"
            ? "Berita baru berhasil dibuat dan disimpan!"
            : "Perubahan berita berhasil diperbarui!"
        );
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1200);
      } else {
        setErrorMessage(data.error || "Gagal menyimpan berita.");
      }
    } catch (err) {
      setErrorMessage("Terjadi kendala jaringan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  // Word & read time calculation
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTimeEst = Math.max(1, Math.ceil(wordCount / 180));

  const presetImages = [
    { label: "Makassar & Strategi", url: "/images/cerita/cerita-01-makassar.jpg" },
    { label: "HR & Rekrutmen", url: "/images/cerita/cerita-02-hr.jpg" },
    { label: "Dream Job & Koran", url: "/images/cerita/cerita-03-dream-job.jpg" },
    { label: "Suasana Diskusi Tim", url: "/images/cerita/cerita-04-diskusi.jpg" },
    { label: "Langkah Karier", url: "/images/cerita/cerita-05-karier.jpg" },
    { label: "Toga & Wisuda", url: "/images/berita/berita-01.jpg" },
    { label: "Peta Transisi", url: "/images/berita/feature-banner.jpg" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 bg-[#BB240A]/15 border-[2px] border-[#BB240A] rounded-xl font-mono text-xs font-bold text-[#BB240A] flex items-center justify-between animate-in fade-in">
          <span>⚠️ {errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-base cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-[#EDCC4D] border-[2px] border-[#623F1B] rounded-xl font-mono text-xs font-extrabold text-[#38200B] flex items-center justify-between shadow-[3px_3px_0px_#623F1B] animate-in fade-in">
          <span>✓ {successMessage} Mengalihkan ke dashboard...</span>
        </div>
      )}

      {/* SECTION 1: INFORMASI DASAR (Title, Slug, Category) */}
      <section className="bg-white border-[2.5px] border-[#623F1B] rounded-2xl p-6 sm:p-8 shadow-[5px_5px_0px_#623F1B] space-y-6">
        <div className="flex items-center justify-between border-b-[2px] border-[#623F1B] pb-3">
          <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-[#BB240A] uppercase tracking-wider">
            <span>01 / IDENTITAS BERITA</span>
          </div>
          <span className="font-mono text-[11px] text-[#623F1B]">
            * Menentukan struktur URL & indeks
          </span>
        </div>

        {/* Title */}
        <div>
          <label className="block font-mono text-xs font-extrabold text-[#38200B] uppercase tracking-wider mb-1.5">
            Judul Berita <span className="text-[#BB240A]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Contoh: Menavigasi 100 Hari Pertama Pasca Wisuda: Dari Toga Menuju Realitas Kerja"
            className="w-full px-4 py-3 bg-[#F7F3EE] border-[2px] border-[#623F1B] rounded-xl font-display font-bold text-lg text-[#38200B] placeholder:text-[#623F1B]/50 focus:outline-none focus:ring-2 focus:ring-[#BB240A] shadow-[2px_2px_0px_#623F1B]"
          />
        </div>

        {/* Slug & Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-mono text-xs font-bold text-[#38200B] uppercase tracking-wider">
                Slug URL (Tautan Unik)
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsSlugManual(false);
                  setSlug(slugify(title));
                }}
                className="font-mono text-[10px] text-[#BB240A] hover:underline"
              >
                Reset ke Judul
              </button>
            </div>
            <div className="flex items-center">
              <span className="bg-[#E5DBD1] border-[2px] border-r-0 border-[#623F1B] px-3 py-2.5 rounded-l-xl font-mono text-xs text-[#623F1B] font-bold">
                /berita/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setIsSlugManual(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="slug-berita-unik"
                className="w-full px-3 py-2.5 bg-[#F7F3EE] border-[2px] border-[#623F1B] rounded-r-xl font-mono text-xs text-[#38200B] font-bold focus:outline-none focus:ring-2 focus:ring-[#BB240A]"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-mono text-xs font-bold text-[#38200B] uppercase tracking-wider mb-1.5">
              Kategori Rubrik <span className="text-[#BB240A]">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F7F3EE] border-[2px] border-[#623F1B] rounded-xl font-mono text-xs font-bold text-[#38200B] focus:outline-none focus:ring-2 focus:ring-[#BB240A] shadow-[2px_2px_0px_#623F1B]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block font-mono text-xs font-bold text-[#38200B] uppercase tracking-wider mb-1.5">
            Ringkasan / Excerpt Berita (Muncul di Kartu & Kutipan Utama)
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Tulis 1-2 kalimat ringkasan yang menarik minat pembaca..."
            className="w-full px-3.5 py-2.5 bg-[#F7F3EE] border-[2px] border-[#623F1B] rounded-xl font-body text-xs sm:text-sm text-[#38200B] focus:outline-none focus:ring-2 focus:ring-[#BB240A]"
          />
        </div>
      </section>

      {/* SECTION 2: CUSTOMIZER GAMBAR SAMPUL (Upload, URL, Preset, Preview) */}
      <section className="bg-white border-[2.5px] border-[#623F1B] rounded-2xl p-6 sm:p-8 shadow-[5px_5px_0px_#623F1B] space-y-6">
        <div className="flex items-center justify-between border-b-[2px] border-[#623F1B] pb-3">
          <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-[#BB240A] uppercase tracking-wider">
            <span>02 / PENAMBAHAN & KUSTOMISASI GAMBAR</span>
          </div>
          <span className="font-mono text-[11px] text-[#623F1B]">
            Mendukung file lokal & link gambar
          </span>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setImageTab("upload")}
            className={`px-4 py-2 rounded-xl font-bold border-[2px] border-[#623F1B] brutal-badge transition-all cursor-pointer ${
              imageTab === "upload"
                ? "bg-[#BB240A] text-white shadow-[2px_2px_0px_#623F1B]"
                : "bg-[#F7F3EE] text-[#38200B] hover:bg-[#E5DBD1]"
            }`}
          >
            📁 Upload dari Komputer
          </button>

          <button
            type="button"
            onClick={() => setImageTab("url")}
            className={`px-4 py-2 rounded-xl font-bold border-[2px] border-[#623F1B] brutal-badge transition-all cursor-pointer ${
              imageTab === "url"
                ? "bg-[#BB240A] text-white shadow-[2px_2px_0px_#623F1B]"
                : "bg-[#F7F3EE] text-[#38200B] hover:bg-[#E5DBD1]"
            }`}
          >
            🔗 Masukkan URL Gambar
          </button>

          <button
            type="button"
            onClick={() => setImageTab("presets")}
            className={`px-4 py-2 rounded-xl font-bold border-[2px] border-[#623F1B] brutal-badge transition-all cursor-pointer ${
              imageTab === "presets"
                ? "bg-[#BB240A] text-white shadow-[2px_2px_0px_#623F1B]"
                : "bg-[#F7F3EE] text-[#38200B] hover:bg-[#E5DBD1]"
            }`}
          >
            🖼 Galeri Cepat (Makassar, HR, Dream Job)
          </button>
        </div>

        {/* Tab 1: Upload */}
        {imageTab === "upload" && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-[2.5px] border-dashed border-[#623F1B] bg-[#F7F3EE] rounded-2xl p-6 sm:p-10 text-center space-y-3 cursor-pointer hover:bg-[#EDCC4D]/15 transition-colors relative"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            <div className="text-4xl">📸</div>
            <div className="space-y-1">
              <p className="font-display font-extrabold text-base text-[#38200B]">
                {uploadingImage
                  ? "Sedang Mengunggah Gambar..."
                  : "Klik untuk memilih file gambar atau seret file ke sini"}
              </p>
              <p className="font-mono text-xs text-[#623F1B]">
                Format didukung: JPG, PNG, WEBP, GIF, SVG (Maks. 10MB)
              </p>
            </div>

            {uploadError && (
              <p className="font-mono text-xs text-[#BB240A] font-bold">
                ⚠️ {uploadError}
              </p>
            )}
          </div>
        )}

        {/* Tab 2: URL */}
        {imageTab === "url" && (
          <div className="space-y-3">
            <label className="block font-mono text-xs font-bold text-[#38200B]">
              Tautan / URL Gambar Eksternal:
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/... atau URL gambar lainnya"
                className="flex-1 px-3.5 py-2.5 bg-[#F7F3EE] border-[2px] border-[#623F1B] rounded-xl font-mono text-xs text-[#38200B] focus:outline-none focus:ring-2 focus:ring-[#BB240A]"
              />
              {coverImage && (
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="px-3 py-2 bg-[#E5DBD1] hover:bg-[#BB240A] hover:text-white font-mono text-xs font-bold rounded-xl border border-[#623F1B]"
                >
                  Kosongkan
                </button>
              )}
            </div>
            <p className="font-mono text-[11px] text-[#623F1B]">
              Ketik atau tempel link gambar dari web, Unsplash, atau CDN mana saja.
            </p>
          </div>
        )}

        {/* Tab 3: Presets */}
        {imageTab === "presets" && (
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-[#38200B] block">
              Pilih dari galeri foto dokumentasi WIS(UDAH):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {presetImages.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCoverImage(preset.url)}
                  className={`group relative rounded-xl overflow-hidden border-[2px] border-[#623F1B] text-left transition-all p-1 flex flex-col justify-between ${
                    coverImage === preset.url
                      ? "ring-4 ring-[#BB240A] bg-[#EDCC4D]"
                      : "bg-[#F7F3EE] hover:bg-white"
                  }`}
                >
                  <div className="relative h-20 w-full rounded-lg overflow-hidden border border-[#623F1B]">
                    <Image
                      src={preset.url}
                      alt={preset.label}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#38200B] pt-1 line-clamp-1">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Image Preview Frame */}
        {coverImage &&
          (coverImage.startsWith("/") ||
            coverImage.startsWith("http://") ||
            coverImage.startsWith("https://")) &&
          coverImage.length > 4 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between font-mono text-xs font-bold text-[#38200B]">
                <span className="text-[#BB240A]">✓ PRATINJAU GAMBAR SAMPUL AKTIF:</span>
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="text-[#BB240A] hover:underline cursor-pointer"
                >
                  Hapus Gambar
                </button>
              </div>

              <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border-[3px] border-[#623F1B] shadow-[5px_5px_0px_#623F1B] bg-zinc-900">
                <SafeImage
                  src={coverImage}
                  fallbackSrc="/images/cerita/cerita-01-makassar.jpg"
                  alt="Pratinjau Sampul"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                <div className="absolute top-3 left-3 bg-[#EDCC4D] text-[#38200B] px-3 py-1 rounded-md text-[10px] font-mono font-extrabold border border-[#623F1B] brutal-badge">
                  TERPILIH
                </div>
              </div>
              <div className="font-mono text-[10px] text-[#623F1B] truncate">
                Path: {coverImage}
              </div>
            </div>
          )}
      </section>

      {/* SECTION 3: CUSTOMIZER ISI BERITA (Content Editor + Toolbar + Live Preview) */}
      <section className="bg-white border-[2.5px] border-[#623F1B] rounded-2xl p-6 sm:p-8 shadow-[5px_5px_0px_#623F1B] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-[2px] border-[#623F1B] pb-3 gap-2">
          <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-[#BB240A] uppercase tracking-wider">
            <span>03 / PENULISAN ISI BERITA</span>
          </div>

          {/* Toggle Editor vs Live Preview */}
          <div className="flex items-center gap-1 bg-[#F7F3EE] p-1 rounded-xl border border-[#623F1B] font-mono text-xs font-bold">
            <button
              type="button"
              onClick={() => setContentTab("editor")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                contentTab === "editor"
                  ? "bg-[#38200B] text-[#EDCC4D]"
                  : "text-[#38200B] hover:bg-[#E5DBD1]"
              }`}
            >
              ✍ Teks Editor
            </button>
            <button
              type="button"
              onClick={() => setContentTab("preview")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                contentTab === "preview"
                  ? "bg-[#38200B] text-[#EDCC4D]"
                  : "text-[#38200B] hover:bg-[#E5DBD1]"
              }`}
            >
              👁 Pratinjau Tampilan
            </button>
          </div>
        </div>

        {contentTab === "editor" ? (
          <div className="space-y-3">
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#F7F3EE] border-[1.5px] border-[#623F1B] rounded-xl font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => insertFormatting("**", "**")}
                className="px-2.5 py-1 bg-white hover:bg-[#EDCC4D] border border-[#623F1B] rounded font-bold"
                title="Teks Tebal"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("*", "*")}
                className="px-2.5 py-1 bg-white hover:bg-[#EDCC4D] border border-[#623F1B] rounded italic"
                title="Teks Miring"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("## ", "")}
                className="px-2.5 py-1 bg-white hover:bg-[#EDCC4D] border border-[#623F1B] rounded"
                title="Judul Bab (H2)"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("### ", "")}
                className="px-2.5 py-1 bg-white hover:bg-[#EDCC4D] border border-[#623F1B] rounded"
                title="Sub-judul (H3)"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("> ", "")}
                className="px-2.5 py-1 bg-white hover:bg-[#EDCC4D] border border-[#623F1B] rounded"
                title="Kutipan / Quote"
              >
                ❝ Quote
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("- ", "")}
                className="px-2.5 py-1 bg-white hover:bg-[#EDCC4D] border border-[#623F1B] rounded"
                title="Poin Daftar"
              >
                • List
              </button>

              <span className="text-[#623F1B]/40 px-1">|</span>

              <span className="text-[11px] text-[#623F1B] font-mono hidden sm:inline">
                {wordCount} kata &bull; ~{readTimeEst} mnt baca
              </span>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              required
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan cerita, laporan investigasi, wawancara, atau refleksi perjalanan lulusan di sini..."
              className="w-full p-4 bg-[#F7F3EE] border-[2px] border-[#623F1B] rounded-xl font-body text-base text-[#38200B] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#BB240A] shadow-[2px_2px_0px_#623F1B]"
            />
          </div>
        ) : (
          /* Live Preview Mode */
          <div className="border-[2px] border-[#623F1B] rounded-2xl p-6 sm:p-8 bg-[#F7F3EE] space-y-6">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#BB240A]">
              <span>👁 TAMPILAN SESUAI HALAMAN ARTIKEL:</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight text-[#38200B]">
              {title || "Judul Berita Ditampilkan Di Sini"}
            </h1>

            {coverImage && (
              <div className="relative w-full h-64 rounded-xl overflow-hidden border-[2px] border-[#623F1B]">
                <Image src={coverImage} alt="Cover" fill className="object-cover" />
              </div>
            )}

            <div className="space-y-4 font-body text-base text-[#38200B] leading-relaxed">
              {content ? (
                content
                  .split(/\n\n+/)
                  .map((p, idx) => {
                    if (p.startsWith("### ")) {
                      return (
                        <h3 key={idx} className="text-xl font-extrabold font-display uppercase pt-2">
                          {p.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (p.startsWith("## ")) {
                      return (
                        <h2 key={idx} className="text-2xl font-extrabold font-display uppercase pt-4 border-b border-[#623F1B] pb-1">
                          {p.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (p.startsWith("> ")) {
                      return (
                        <blockquote key={idx} className="border-l-4 border-[#BB240A] bg-white p-3 rounded-r-lg italic">
                          {p.replace("> ", "")}
                        </blockquote>
                      );
                    }
                    return <p key={idx}>{p}</p>;
                  })
              ) : (
                <p className="italic text-[#623F1B]">Isi cerita masih kosong.</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 4: STATUS PUBLIKASI & AKSI SIMPAN */}
      <section className="bg-white border-[2.5px] border-[#623F1B] rounded-2xl p-6 sm:p-8 shadow-[5px_5px_0px_#623F1B] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 font-mono text-xs font-extrabold text-[#38200B] cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-[#BB240A] rounded"
              />
              <span>PUBLIKASIKAN LANGSUNG (LIVE KE PEMBACA)</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 font-mono text-xs font-extrabold text-[#38200B] cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#EDCC4D] rounded"
              />
              <span>JADIKAN BERITA PILIHAN UTAMA (★ FEATURED)</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 font-mono text-xs font-extrabold">
          <Link
            href="/admin"
            className="px-5 py-3 rounded-xl bg-[#E5DBD1] hover:bg-white text-[#38200B] border-[2px] border-[#623F1B] brutal-badge transition-colors"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 rounded-xl bg-[#BB240A] hover:bg-[#38200B] text-white border-[2px] border-[#623F1B] brutal-pill transition-all cursor-pointer shadow-[3px_3px_0px_#623F1B] disabled:opacity-50"
          >
            {saving ? "Menyimpan Data..." : "💾 Simpan Berita ➔"}
          </button>
        </div>
      </section>
    </form>
  );
}
