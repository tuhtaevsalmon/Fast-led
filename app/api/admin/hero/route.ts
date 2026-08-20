import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import { readSite, saveUploadedFile, writeSite } from "@/lib/content/store"

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  return NextResponse.json((await readSite()).hero)
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  try {
    const contentType = request.headers.get("content-type") || ""
    const site = await readSite()

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData()
      const title = String(form.get("title") ?? site.hero.title).trim()
      const caption = String(form.get("caption") ?? site.hero.caption).trim()
      let image = site.hero.image
      let imageDark = site.hero.imageDark ?? ""
      const slot = String(form.get("slot") ?? "light")
      const file = form.get("file")
      if (file instanceof File && file.size > 0) {
        const url = await saveUploadedFile(file, "hero")
        if (slot === "dark") imageDark = url
        else image = url
      }
      if (String(form.get("clearDark") ?? "") === "1") {
        imageDark = ""
      }
      site.hero = {
        image,
        imageDark,
        title: title || site.hero.title,
        caption: caption || site.hero.caption,
      }
    } else {
      const body = await request.json().catch(() => ({}))
      const imageDark =
        body.imageDark === undefined
          ? site.hero.imageDark ?? ""
          : String(body.imageDark ?? "").trim()
      site.hero = {
        image: String(body.image ?? site.hero.image).trim() || site.hero.image,
        imageDark,
        title: String(body.title ?? site.hero.title).trim() || site.hero.title,
        caption: String(body.caption ?? site.hero.caption).trim() || site.hero.caption,
      }
    }

    const saved = await writeSite(site)
    return NextResponse.json(saved.hero)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ошибка сохранения" },
      { status: 500 }
    )
  }
}
