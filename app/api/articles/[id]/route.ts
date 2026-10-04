import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error("Get article error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengambil data artikel" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      coverImage,
      categoryId,
      isPublished,
      featured,
    } = body;

    const existing = await prisma.article.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    // Slug check if custom slug changed
    let finalSlug = existing.slug;
    if (customSlug && customSlug !== existing.slug) {
      const cleanSlug = slugify(customSlug);
      const duplicate = await prisma.article.findFirst({
        where: { slug: cleanSlug, NOT: { id } },
      });
      if (duplicate) {
        finalSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
      } else {
        finalSlug = cleanSlug;
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (finalSlug !== undefined) updateData.slug = finalSlug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (featured !== undefined) updateData.featured = Boolean(featured);

    if (isPublished !== undefined) {
      updateData.isPublished = Boolean(isPublished);
      if (isPublished && !existing.isPublished && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const updated = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        author: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Berita berhasil diperbarui!",
      article: updated,
    });
  } catch (error: any) {
    console.error("Update article error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memperbarui berita" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const existing = await prisma.article.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Berita berhasil dihapus!",
    });
  } catch (error: any) {
    console.error("Delete article error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal menghapus berita" },
      { status: 500 }
    );
  }
}
