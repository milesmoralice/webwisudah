import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("Categories error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal mengambil data kategori" },
      { status: 500 }
    );
  }
}
