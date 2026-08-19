import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"
import { PRODUCTS } from "@/lib/products"
import { PROJECTS } from "@/lib/portfolio"
import type { Product, Project, SiteContent, SiteSettings } from "@/lib/types"

const LOCAL_FILE = path.join(process.cwd(), "data", "site.json")
const BLOB_KEY = "cms/site.json"

export const DEFAULT_SETTINGS: SiteSettings = {
  phone: "+992 98 713 99 56",
  phoneTel: "+992987139956",
  whatsapp: "992987139956",
  instagram: "fastled.tj",
  address: "пр. Рудаки 36, Душанбе",
  email: "hello@fastled.tj",
}

function seed(): SiteContent {
  return {
    settings: DEFAULT_SETTINGS,
    products: PRODUCTS.map((p) => ({ ...p, hidden: p.hidden ?? false })),
    projects: PROJECTS.slice(0, 3).map((p) => ({
      id: p.id,
      title: p.title,
      city: p.city,
      area: p.area,
      pitch: p.pitch,
      place: p.place,
      image: p.image,
      showOnHome: true,
    })),
  }
}

const PLACEHOLDER_PHONE = "992900000000"

function normalize(raw: Partial<SiteContent> | null): SiteContent {
  const base = seed()
  if (!raw) return base
  const settings = { ...base.settings, ...raw.settings }
  const digits = String(settings.phone || "").replace(/\D/g, "")
  if (!digits || digits === PLACEHOLDER_PHONE) {
    settings.phone = base.settings.phone
    settings.phoneTel = base.settings.phoneTel
    settings.whatsapp = base.settings.whatsapp
  }
  return {
    settings,
    products: (raw.products ?? base.products).map((p) => ({
      ...p,
      hidden: Boolean(p.hidden),
    })),
    projects: (raw.projects ?? base.projects).slice(0, 3).map((p) => ({
      ...p,
      showOnHome: true,
    })),
  }
}

function useRemoteBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN && process.env.VERCEL)
}

async function parseBlobJson(text: string) {
  return normalize(JSON.parse(text))
}

async function readBlob(): Promise<SiteContent | null> {
  if (!useRemoteBlob()) return null
  try {
    const { get } = await import("@vercel/blob")
    const result = await get(BLOB_KEY, { access: "public", useCache: true })
    if (result?.statusCode === 200 && result.stream) {
      return parseBlobJson(await new Response(result.stream).text())
    }
  } catch {
    /* try list fallback */
  }
  try {
    const { list } = await import("@vercel/blob")
    const { blobs } = await list({ prefix: BLOB_KEY, limit: 5 })
    const file = blobs.find((b) => b.pathname === BLOB_KEY) ?? blobs[0]
    if (!file) return null
    const res = await fetch(file.url, { next: { revalidate: 30 } })
    if (!res.ok) return null
    return parseBlobJson(await res.text())
  } catch {
    return null
  }
}

async function writeBlob(content: SiteContent) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false
  try {
    const { put } = await import("@vercel/blob")
    await put(BLOB_KEY, JSON.stringify(content, null, 2), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    return true
  } catch {
    return false
  }
}

let mem: SiteContent | null = null
let inflight: Promise<SiteContent> | null = null

async function loadSite(): Promise<SiteContent> {
  const fromBlob = await readBlob()
  if (fromBlob) return fromBlob
  if (useRemoteBlob()) return seed()
  try {
    const text = await readFile(LOCAL_FILE, "utf8")
    return normalize(JSON.parse(text))
  } catch {
    return seed()
  }
}

export async function readSite(): Promise<SiteContent> {
  if (mem) return mem
  if (!inflight) {
    inflight = loadSite()
      .then((data) => {
        mem = data
        return data
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export async function writeSite(content: SiteContent) {
  const next = normalize(content)
  mem = next
  if (useRemoteBlob()) {
    const blobOk = await writeBlob(next)
    if (!blobOk) {
      throw new Error("Не удалось сохранить. На Vercel проверьте BLOB_READ_WRITE_TOKEN.")
    }
    return next
  }
  try {
    await mkdir(path.dirname(LOCAL_FILE), { recursive: true })
    await writeFile(LOCAL_FILE, JSON.stringify(next, null, 2), "utf8")
  } catch {
    throw new Error("Не удалось сохранить. Локально проверьте папку data/.")
  }
  return next
}

export async function getPublicProducts(): Promise<Product[]> {
  const site = await readSite()
  return site.products.filter((p) => !p.hidden)
}

export async function getAllProducts(): Promise<Product[]> {
  return (await readSite()).products
}

export async function getPublicProjects(): Promise<Project[]> {
  return (await readSite()).projects
}

export async function getHomeProjects(): Promise<Project[]> {
  return (await getPublicProjects()).slice(0, 3)
}

export async function getSettings(): Promise<SiteSettings> {
  return (await readSite()).settings
}

export async function saveUploadedFile(file: File, folder: string) {
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "")
  const safeExt = ["png", "jpg", "jpeg", "webp", "gif"].includes(ext) ? ext : "png"
  const name = `${folder}-${Date.now()}.${safeExt}`
  const bytes = Buffer.from(await file.arrayBuffer())

  if (useRemoteBlob() || process.env.CMS_USE_BLOB === "1") {
    const { put } = await import("@vercel/blob")
    const uploaded = await put(`cms/uploads/${name}`, bytes, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || "image/png",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    return uploaded.url
  }

  const rel = `/uploads/${name}`
  const dest = path.join(process.cwd(), "public", "uploads", name)
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, bytes)
  return rel
}
