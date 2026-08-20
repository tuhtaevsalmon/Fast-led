import { NextResponse } from "next/server"
import { checkLogin, sessionToken, setAdminCookie } from "@/lib/admin-auth"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const login = String(body.login ?? "").trim()
  const password = String(body.password ?? "")
  if (!login || !password || !(await checkLogin(login, password))) {
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 })
  }
  const token = await sessionToken()
  if (!token) {
    return NextResponse.json(
      { error: "На сервере не задан ADMIN_SECRET или ADMIN_PASSWORD" },
      { status: 500 }
    )
  }
  const res = NextResponse.json({ ok: true })
  setAdminCookie(res, token)
  return res
}
