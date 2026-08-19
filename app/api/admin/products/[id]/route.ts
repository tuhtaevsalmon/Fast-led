import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import { parseProduct } from "@/lib/content/parse"
import { readSite, writeSite } from "@/lib/content/store"

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  const { id } = await ctx.params
  const body = await request.json()
  const site = await readSite()
  const index = site.products.findIndex((p) => p.id === id)
  if (index < 0) return NextResponse.json({ error: "Не найдено" }, { status: 404 })
  site.products[index] = parseProduct(body, site.products[index])
  await writeSite(site)
  return NextResponse.json(site.products[index])
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  const { id } = await ctx.params
  const site = await readSite()
  site.products = site.products.filter((p) => p.id !== id)
  await writeSite(site)
  return NextResponse.json({ ok: true })
}
