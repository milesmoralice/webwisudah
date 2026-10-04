import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper function to create clean slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const categorySlug = searchParams.get("category");
    const status = searchParams.get("status"); // "published", "draft", "all"
    const featured = searchParams.get("featured"); // "true", "false"
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const where: any = {};

    if (status === "published") {
      where.isPublished = true;
    } else if (status === "draft") {
      where.isPublished = false;
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ success: true, count: articles.length, articles });
  } catch (error: any) {
    console.error("Fetch articles error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengambil data artikel" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      coverImage,
      categoryId,
      isPublished = false,
      featured = false,
    } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: "Judul, konten isi berita, dan kategori wajib diisi." },
        { status: 400 }
      );
    }

    // Determine unique slug
    let baseSlug = customSlug ? slugify(customSlug) : slugify(title);
    if (!baseSlug) baseSlug = `berita-${Date.now()}`;
    let finalSlug = baseSlug;
    let count = 1;

    while (await prisma.article.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${count}`;
      count++;
    }

    // Find default author (Admin)
    let author = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!author) {
      author = await prisma.user.create({
        data: {
          name: "Redaksi WIS(UDAH)",
          email: "redaksi@wisudah.id",
          role: "ADMIN",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
      });
    }

    const newArticle = await prisma.article.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || title.slice(0, 150),
        content,
        coverImage: coverImage || null,
        categoryId,
        authorId: author.id,
        isPublished: Boolean(isPublished),
        featured: Boolean(featured),
        publishedAt: isPublished ? new Date() : null,
      },
      include: {
        category: true,
        author: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Berita berhasil ditambahkan!",
      article: newArticle,
    });
  } catch (error: any) {
    console.error("Create article error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal membuat berita baru" },
      { status: 500 }
    );
  }
}
