import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import { readSite, saveUploadedFile, writeSite } from "@/lib/content/store"

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  const { id } = await ctx.params
  const form = await request.formData()
  const file = form.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Выберите файл" }, { status: 400 })
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Файл больше 8 МБ" }, { status: 400 })
  }
  try {
    const site = await readSite()
    const product = site.products.find((p) => p.id === id)
    if (!product) return NextResponse.json({ error: "Не найдено" }, { status: 404 })
    if (form.get("remove") === "1") {
      product.image = ""
      await writeSite(site)
      return NextResponse.json(product)
    }
    product.image = await saveUploadedFile(file, id)
    await writeSite(site)
    return NextResponse.json(product)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка загрузки" },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  const { id } = await ctx.params
  try {
    const site = await readSite()
    const product = site.products.find((p) => p.id === id)
    if (!product) return NextResponse.json({ error: "Не найдено" }, { status: 404 })
    product.image = ""
    await writeSite(site)
    return NextResponse.json(product)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка удаления" },
      { status: 500 }
    )
  }
}
