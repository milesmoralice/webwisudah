"use client";

import { useState } from "react";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Baca cerita ini di WIS(UDAH): "${title}"\n${url}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    }
  };

  const handleTwitter = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`"${title}" via @wisudah_id`);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="font-mono text-xs font-bold text-[#623F1B] uppercase tracking-wider mr-1">
        Bagikan:
      </span>

      <button
        onClick={handleCopyLink}
        className="px-3.5 py-1.5 bg-[#EDCC4D] hover:bg-[#E5DBD1] text-[#38200B] font-mono text-xs font-extrabold rounded-lg brutal-badge flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
      >
        <span>{copied ? "✓ Tersalin!" : "🔗 Salin Tautan"}</span>
      </button>

      <button
        onClick={handleWhatsApp}
        className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-mono text-xs font-extrabold rounded-lg brutal-badge flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
      >
        <span>💬 WhatsApp</span>
      </button>

      <button
        onClick={handleTwitter}
        className="px-3.5 py-1.5 bg-black hover:bg-zinc-800 text-white font-mono text-xs font-extrabold rounded-lg brutal-badge flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
      >
        <span>𝕏 Post</span>
      </button>
    </div>
  );
}
