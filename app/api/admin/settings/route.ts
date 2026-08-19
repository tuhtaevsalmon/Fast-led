import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import { formatTjPhone } from "@/lib/format"
import { readSite, writeSite } from "@/lib/content/store"

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  return NextResponse.json(await readSite())
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const site = await readSite()
    if (body.settings) {
      const next = { ...site.settings, ...body.settings }
      const phone = formatTjPhone(String(next.phone ?? ""))
      const digits = phone.replace(/\D/g, "")
      site.settings = {
        ...next,
        phone,
        phoneTel: digits ? `+${digits}` : "",
        whatsapp: digits,
      }
    }
    const saved = await writeSite(site)
    return NextResponse.json(saved.settings)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка сохранения" },
      { status: 500 }
    )
  }
}
