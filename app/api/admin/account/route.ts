import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import { makeCredentials, writeCredentials } from "@/lib/admin-credentials"

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  try {
    const body = await request.json().catch(() => ({}))
    const newLogin = String(body.newLogin ?? "").trim()
    const newPassword = String(body.newPassword ?? "")
    const confirmPassword = String(body.confirmPassword ?? "")

    if (newLogin.length < 3) {
      return NextResponse.json({ error: "Логин минимум 3 символа" }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Новый пароль минимум 6 символов" }, { status: 400 })
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Пароли не совпадают" }, { status: 400 })
    }

    await writeCredentials(await makeCredentials(newLogin, newPassword))
    return NextResponse.json({ ok: true, login: newLogin })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка сохранения" },
      { status: 500 }
    )
  }
}
