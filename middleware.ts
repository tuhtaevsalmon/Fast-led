import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const COOKIE = "fl_admin"

async function tokenFromEnv() {
  const password = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "fastled")
  const secret = process.env.ADMIN_SECRET || password || "fastled-dev"
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("ok"))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === "/admin/login"
  const isAdminPage = pathname.startsWith("/admin")
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login"

  if (!isAdminPage && !isAdminApi) return NextResponse.next()
  if (isLogin || pathname === "/api/admin/login") return NextResponse.next()

  const expected = await tokenFromEnv()
  const got = request.cookies.get(COOKIE)?.value
  if (got && expected && got === expected) return NextResponse.next()

  if (isAdminApi) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  const url = request.nextUrl.clone()
  url.pathname = "/admin/login"
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
