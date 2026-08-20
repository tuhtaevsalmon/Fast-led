import { NextResponse } from "next/server"
import { readBlobFile } from "@/lib/content/blob"

type Ctx = { params: Promise<{ path: string[] }> }

// Proxies uploaded files from Vercel Blob through our own origin. Needed
// because some Blob stores only allow "private" access, whose URLs return
// 403 when fetched directly by the browser without a signed token.
export async function GET(_request: Request, ctx: Ctx) {
  const { path: parts } = await ctx.params
  const pathname = parts.join("/")
  const file = await readBlobFile(pathname)
  if (!file) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 404 })
  }
  return new NextResponse(file.stream, {
    headers: {
      "Content-Type": file.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
