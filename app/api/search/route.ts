import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q) {
      // Return popular / recent published articles as suggestions
      const defaultArticles = await prisma.article.findMany({
        where: { isPublished: true },
        take: 6,
        orderBy: { views: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          category: { select: { name: true, slug: true } },
          publishedAt: true,
        },
      });
      return NextResponse.json({ success: true, results: defaultArticles, query: "" });
    }

    const results = await prisma.article.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { category: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: 8,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: { select: { name: true, slug: true } },
        publishedAt: true,
      },
    });

    return NextResponse.json({ success: true, results, query: q });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal melakukan pencarian" },
      { status: 500 }
    );
  }
}
