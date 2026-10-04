"use client";

import { useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | string | null;
  views: number;
  category: { id: string; name: string; slug: string };
  author: { name: string | null };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface AllArticlesSectionProps {
  articles: ArticleItem[];
  categories: CategoryItem[];
}

export default function AllArticlesSection({
  articles,
  categories,
}: AllArticlesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredArticles =
    selectedCategory === "ALL"
      ? articles
      : articles.filter((a) => a.category.id === selectedCategory);

  return (
    <section id="semua" className="space-y-8 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-[2.5px] border-[#623F1B] pb-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-[#BB240A] uppercase tracking-wider">
            <span>KATALOG LENGKAP</span>
            <span>/</span>
            <span>DOKUMENTASI WIS(UDAH)</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-[#38200B]">
            Arsip Semua Cerita & Riset
          </h3>
        </div>

        <span className="font-mono text-xs font-bold text-[#623F1B] bg-white border border-[#623F1B] px-3 py-1.5 rounded-lg brutal-badge">
          MENAMPILKAN {filteredArticles.length} CERITA
        </span>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-3.5 py-1.5 rounded-xl border-[2px] border-[#623F1B] brutal-badge transition-all cursor-pointer ${
            selectedCategory === "ALL"
              ? "bg-[#38200B] text-[#EDCC4D] shadow-[2px_2px_0px_#623F1B]"
              : "bg-white text-[#38200B] hover:bg-[#EDCC4D]/30"
          }`}
        >
          SEMUA ({articles.length})
        </button>

        {categories.map((c) => {
          const count = articles.filter((a) => a.category.id === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl border-[2px] border-[#623F1B] brutal-badge transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? "bg-[#38200B] text-[#EDCC4D] shadow-[2px_2px_0px_#623F1B]"
                  : "bg-white text-[#38200B] hover:bg-[#EDCC4D]/30"
              }`}
            >
              {c.name.toUpperCase()} ({count})
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredArticles.map((article, idx) => (
          <Link
            key={article.id}
            href={`/berita/${article.slug}`}
            className="group bg-white border-[3px] border-[#623F1B] rounded-2xl overflow-hidden shadow-[5px_5px_0px_#623F1B] hover:shadow-[8px_8px_0px_#623F1B] hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between"
          >
            {/* Thumbnail */}
            {article.coverImage ? (
              <div className="relative h-48 w-full overflow-hidden border-b-[2.5px] border-[#623F1B] bg-zinc-900">
                <SafeImage
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <span className="absolute top-3 left-3 bg-[#EDCC4D] text-[#38200B] px-2.5 py-0.5 rounded font-mono text-[10px] font-extrabold border border-[#623F1B] brutal-badge">
                  {article.category.name}
                </span>
              </div>
            ) : (
              <div className="h-48 w-full bg-[#E5DBD1] border-b-[2.5px] border-[#623F1B] flex items-center justify-center font-mono font-bold text-xs text-[#38200B]">
                WIS(UDAH) ARSIP
              </div>
            )}

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#623F1B]">
                  <span>NO. {String(idx + 1).padStart(2, "0")}</span>
                  <span>{article.views} PEMBACA</span>
                </div>

                <h4 className="font-display font-extrabold text-lg sm:text-xl text-[#38200B] group-hover:text-[#BB240A] transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h4>

                {article.excerpt && (
                  <p className="font-body text-xs sm:text-sm text-[#623F1B] line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t-[1.5px] border-dashed border-[#623F1B]/30 flex items-center justify-between text-xs font-mono font-extrabold text-[#38200B]">
                <span className="group-hover:text-[#BB240A] transition-colors">
                  BACA ARTIKEL
                </span>
                <span className="text-base group-hover:translate-x-1 transition-transform">
                  ➔
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
