import { cookies } from "next/headers";

export const ADMIN_PASSWORD = "kelompok2ceria";
export const ADMIN_COOKIE_NAME = "wisudah_admin_session";
export const ADMIN_SESSION_TOKEN = "token_session_kelompok2ceria_auth_2026";

/**
 * Check if the current request has a valid admin session cookie
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE_NAME);
    return session?.value === ADMIN_SESSION_TOKEN;
  } catch (err) {
    return false;
  }
}
