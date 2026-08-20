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

// True when Vercel's OIDC auth is set up for this project's Blob store
// (this is what "Connect to Project" wires up today; it does NOT set
// BLOB_READ_WRITE_TOKEN, only VERCEL_OIDC_TOKEN + BLOB_STORE_ID).
function hasOidcBlobAuth() {
  return Boolean(process.env.VERCEL_OIDC_TOKEN) && Boolean(blobStoreId())
}

export function hasBlobToken() {
  return Boolean(blobToken()) || hasOidcBlobAuth()
}

// Rewrites direct "private" Blob URLs to go through our /api/media proxy,
// since those URLs 403 when the browser requests them without a signed
// token. Public blob URLs and local /uploads paths are left untouched.
export function toDisplayImageUrl(image: string | undefined | null): string {
  if (!image) return image ?? ""
  try {
    const url = new URL(image)
    if (url.hostname.endsWith(".private.blob.vercel-storage.com")) {
      return `/api/media${url.pathname}`
    }
  } catch {
    // Relative path (e.g. /uploads/x.png or /led/x.png) — nothing to rewrite.
  }
  return image
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

// Streams a blob's raw bytes + content type, trying both access levels.
// Used to proxy files (e.g. uploaded images) through our own API route so
// the browser never needs a direct, possibly-private, blob URL.
export async function readBlobFile(
  pathname: string
): Promise<{ stream: ReadableStream<Uint8Array>; contentType: string | null } | null> {
  const { get, list } = await import("@vercel/blob")
  const auth = blobAuth()

  for (const access of ["private", "public"] as const) {
    try {
      const result = await get(pathname, { access, useCache: false, ...auth })
      if (result?.statusCode === 200 && result.stream) {
        return { stream: result.stream, contentType: result.blob.contentType }
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
    if (!res.ok || !res.body) return null
    return { stream: res.body, contentType: res.headers.get("content-type") }
  } catch {
    return null
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
