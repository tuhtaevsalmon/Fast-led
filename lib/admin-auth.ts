import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const COOKIE = "fl_admin"

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "fastled")
}

let tokenCache: string | null = null

async function sign(value: string) {
  const secret = process.env.ADMIN_SECRET || adminPassword() || "fastled-dev"
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function sessionToken() {
  if (!tokenCache) tokenCache = await sign("ok")
  return tokenCache
}

export async function isAdminCookie(value?: string) {
  if (!value || !adminPassword()) return false
  return value === (await sessionToken())
}

export async function isAdminRequest() {
  const jar = await cookies()
  return isAdminCookie(jar.get(COOKIE)?.value)
}

export function setAdminCookie(res: NextResponse, token: string) {
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  })
}

export function clearAdminCookie(res: NextResponse) {
  res.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 })
}

export { COOKIE as ADMIN_COOKIE }
