// Client-side helper for admin forms: reads the response body once as text,
// then tries to parse it as JSON. Falls back gracefully when the server
// (or a platform-level proxy/error page) returns non-JSON output, so callers
// always get an { ok, data } pair instead of a thrown parse error.
export async function parseResponse(res: Response): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  const text = await res.text().catch(() => "")
  let data: Record<string, unknown> = {}
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { __raw: text }
    }
  }
  return { ok: res.ok, data }
}

// Builds a diagnostic message that always includes the HTTP status, and the
// raw response body when the server didn't return a structured JSON error
// (e.g. a Vercel platform error like "413 Payload Too Large").
export function errorMessage(res: Response, data: Record<string, unknown>, fallback = "Ошибка") {
  if (typeof data.error === "string" && data.error) {
    return `${data.error} (${res.status})`
  }
  const raw = typeof data.__raw === "string" ? data.__raw.trim() : ""
  if (raw) {
    return `${fallback} (${res.status}): ${raw.slice(0, 200)}`
  }
  return `${fallback} (${res.status})`
}
