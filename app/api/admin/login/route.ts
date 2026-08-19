import { NextResponse } from "next/server"
import { adminPassword, sessionToken, setAdminCookie } from "@/lib/admin-auth"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const password = String(body.password ?? "")
  const expected = adminPassword()
  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  setAdminCookie(res, await sessionToken())
  return res
}
