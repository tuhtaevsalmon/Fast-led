import type { PutBlobResult } from "@vercel/blob"

// Mirrors the body type @vercel/blob's put() actually accepts.
// Derived from the function itself (not re-declared by hand) so it can't drift out of sync,
// since @vercel/blob does not publicly export its internal `PutBody` type.
type PutBody = Parameters<typeof import("@vercel/blob").put>[1]

export function blobToken() {
  return (process.env.BLOB_READ_WRITE_TOKEN || "").trim().replace(/^["']|["']$/g, "")
}

export function blobStoreId() {
  return (process.env.BLOB_STORE_ID || "").trim().replace(/^["']|["']$/g, "")
}

export function hasBlobToken() {
  return Boolean(blobToken())
}

export function useRemoteBlob() {
  return hasBlobToken() && Boolean(process.env.VERCEL)
}

function blobAuth() {
  const token = blobToken()
  const storeId = blobStoreId()
  return {
    token: token || undefined,
    ...(storeId ? { storeId } : {}),
  }
}

export async function putBlob(
  pathname: string,
  body: PutBody,
  options: {
    access?: "public" | "private"
    contentType: string
    cacheControlMaxAge?: number
  }
): Promise<PutBlobResult> {
  const { put } = await import("@vercel/blob")
  const auth = blobAuth()
  const base = {
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: options.contentType,
    cacheControlMaxAge: options.cacheControlMaxAge,
    ...auth,
  } as const

  const preferred = options.access ?? "private"
  const fallback = preferred === "private" ? "public" : "private"

  try {
    return await put(pathname, body, { ...base, access: preferred })
  } catch (first) {
    try {
      return await put(pathname, body, { ...base, access: fallback })
    } catch (second) {
      const message =
        second instanceof Error
          ? second.message
          : first instanceof Error
            ? first.message
            : "Blob put failed"
      console.error("blob put failed", first, second)
      throw new Error(message)
    }
  }
}

export async function readBlobText(pathname: string): Promise<string | null> {
  const { get, list } = await import("@vercel/blob")
  const auth = blobAuth()

  for (const access of ["private", "public"] as const) {
    try {
      const result = await get(pathname, {
        access,
        useCache: false,
        ...auth,
      })
      if (result?.statusCode === 200 && result.stream) {
        return await new Response(result.stream).text()
      }
    } catch {
      /* try next */
    }
  }

  try {
    const { blobs } = await list({ prefix: pathname, limit: 5, ...auth })
    const file = blobs.find((b) => b.pathname === pathname) ?? blobs[0]
    if (!file) return null
    const res = await fetch(file.url, { cache: "no-store" })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}
