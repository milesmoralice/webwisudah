"use client";

import { useState, useEffect } from "react";

interface CommentItem {
  id: string;
  content: string;
  guestName: string | null;
  createdAt: string;
  user?: { name: string | null; avatar: string | null } | null;
}

interface CommentsSectionProps {
  articleId: string;
  initialComments?: CommentItem[];
}

export default function CommentsSection({
  articleId,
  initialComments = [],
}: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    // Refresh comments
    fetch(`/api/comments?articleId=${articleId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.comments) {
          setComments(data.comments);
        }
      })
      .catch((err) => console.error("Comments fetch error:", err));
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          content: content.trim(),
          guestName: name.trim() || "Pembaca Anonim",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setComments([data.comment, ...comments]);
        setContent("");
        setMessage({ text: "Terima kasih! Suaramu telah tercatat dalam arsip diskusi.", type: "success" });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ text: data.error || "Gagal mengirimkan komentar.", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: "Terjadi kesalahan koneksi.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-8 pt-8 border-t-[2.5px] border-[#623F1B]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-tight text-[#38200B]">
            Ruang Diskusi & Respon
          </h3>
          <span className="bg-[#EDCC4D] text-[#38200B] text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full brutal-badge">
            {comments.length} CATATAN
          </span>
        </div>
        <span className="font-mono text-xs text-[#623F1B] hidden sm:inline">
          [ARSIP PEMBACA WIS(UDAH)]
        </span>
      </div>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-[2.5px] border-[#623F1B] rounded-2xl p-6 shadow-[5px_5px_0px_#623F1B] space-y-4"
      >
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#BB240A] uppercase tracking-wider">
          <span>✍</span>
          <span>Tulis Pandangan atau Pengalamanmu:</span>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg border font-mono text-xs font-bold ${
              message.type === "success"
                ? "bg-[#EDCC4D]/40 text-[#38200B] border-[#623F1B]"
                : "bg-[#BB240A]/20 text-[#BB240A] border-[#BB240A]"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs font-bold text-[#38200B] mb-1">
              Nama atau Inisial <span className="text-[#623F1B] font-normal">(opsional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Alumni Unhas '24 atau Fulan"
              className="w-full px-3.5 py-2.5 bg-[#F7F3EE] border-[1.5px] border-[#623F1B] rounded-lg font-body text-sm text-[#38200B] focus:outline-none focus:ring-2 focus:ring-[#BB240A]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs font-bold text-[#38200B] mb-1">
            Respon Anda <span className="text-[#BB240A]">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bagikan refleksi, tips, atau pertanyaan seputar cerita ini..."
            className="w-full px-3.5 py-2.5 bg-[#F7F3EE] border-[1.5px] border-[#623F1B] rounded-lg font-body text-sm text-[#38200B] focus:outline-none focus:ring-2 focus:ring-[#BB240A]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#BB240A] hover:bg-[#38200B] text-white px-6 py-2.5 rounded-full font-mono font-extrabold text-xs brutal-pill transition-colors cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Mengirim Catatan..." : "Kirim Respon ➔"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="p-8 text-center bg-[#E5DBD1]/40 border-[2px] border-dashed border-[#623F1B] rounded-xl font-mono text-xs text-[#623F1B]">
            Belum ada catatan diskusi untuk cerita ini. Jadilah yang pertama memberikan respon!
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white border-[2px] border-[#623F1B] rounded-xl p-5 shadow-[3px_3px_0px_#623F1B] space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#EDCC4D] border border-[#623F1B] flex items-center justify-center font-mono text-xs font-bold text-[#38200B]">
                    {(comment.guestName || "P")[0].toUpperCase()}
                  </span>
                  <span className="font-mono text-xs font-extrabold text-[#38200B]">
                    {comment.guestName || comment.user?.name || "Pembaca Anonim"}
                  </span>
                  <span className="bg-[#E5DBD1] text-[#38200B] text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-[#623F1B]/40">
                    PEMBACA
                  </span>
                </div>

                <span className="font-mono text-[10px] text-[#623F1B]">
                  {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="font-body text-sm text-[#38200B] leading-relaxed pl-8">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
