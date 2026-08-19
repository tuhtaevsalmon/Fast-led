import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import { parseProject } from "@/lib/content/parse"
import { readSite, writeSite } from "@/lib/content/store"

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  return NextResponse.json((await readSite()).projects)
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  const body = await request.json()
  const site = await readSite()
  if (site.projects.length >= 3) {
    return NextResponse.json({ error: "Можно только 3 проекта на главной" }, { status: 400 })
  }
  const project = parseProject(body)
  site.projects.push(project)
  await writeSite(site)
  return NextResponse.json(project)
}
