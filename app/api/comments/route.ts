import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("articleId");

    if (!articleId) {
      return NextResponse.json(
        { error: "articleId query parameter is required" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ success: true, comments });
  } catch (error: any) {
    console.error("Get comments error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengambil komentar" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { articleId, content, guestName, guestEmail } = body;

    if (!articleId || !content || !content.trim()) {
      return NextResponse.json(
        { error: "Komentar dan ID artikel wajib diisi" },
        { status: 400 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        articleId,
        content: content.trim(),
        guestName: guestName?.trim() || "Pembaca Anonim",
        guestEmail: guestEmail?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Komentar berhasil dikirimkan!",
      comment: newComment,
    });
  } catch (error: any) {
    console.error("Create comment error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengirimkan komentar" },
      { status: 500 }
    );
  }
}
