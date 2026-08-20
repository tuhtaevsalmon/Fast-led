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
  try {
    const site = await readSite()
    const project = site.projects.find((p) => p.id === id)
    if (!project) return NextResponse.json({ error: "Не найдено" }, { status: 404 })
    project.image = await saveUploadedFile(file, id)
    await writeSite(site)
    return NextResponse.json(project)
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
    const project = site.projects.find((p) => p.id === id)
    if (!project) return NextResponse.json({ error: "Не найдено" }, { status: 404 })
    project.image = ""
    await writeSite(site)
    return NextResponse.json(project)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка удаления" },
      { status: 500 }
    )
  }
}
