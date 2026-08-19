import { NextResponse } from "next/server"
import { isAdminRequest } from "@/lib/admin-auth"
import { parseProduct } from "@/lib/content/parse"
import { readSite, writeSite } from "@/lib/content/store"

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  const site = await readSite()
  return NextResponse.json(site.products)
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Нужен вход" }, { status: 401 })
  }
  const body = await request.json()
  const site = await readSite()
  const product = parseProduct(body)
  if (site.products.some((p) => p.slug === product.slug)) {
    product.slug = `${product.slug}-${Date.now()}`
  }
  site.products.push(product)
  await writeSite(site)
  return NextResponse.json(product)
}
