import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_PASSWORD, ADMIN_COOKIE_NAME, ADMIN_SESSION_TOKEN } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Kata sandi salah. Akses ditolak." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_SESSION_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return NextResponse.json({ success: true, message: "Login berhasil." });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Terjadi kendala pada server saat memproses login." },
      { status: 500 }
    );
  }
}
