import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"
import { PRODUCTS } from "@/lib/products"
import { PROJECTS } from "@/lib/portfolio"
import { hasBlobToken, putBlob, readBlobText, toDisplayImageUrl, useRemoteBlob } from "@/lib/content/blob"
import type { HomeHero, Product, Project, SiteContent, SiteSettings } from "@/lib/types"

const LOCAL_FILE = path.join(process.cwd(), "data", "site.json")
const BLOB_KEY = "cms/site.json"

export const DEFAULT_SETTINGS: SiteSettings = {
  phone: "+992 98 713 99 56",
  phoneTel: "+992987139956",
  whatsapp: "992987139956",
  instagram: "fastled.tj",
  address: "пр. Рудаки 36, Душанбе",
}

export const DEFAULT_HERO: HomeHero = {
  image: "/led/hero-stage-light.png",
  imageDark: "/led/hero-stage.png",
  title: "Unilumin Upad IV P2.6",
  caption: "Шаг 2,6 мм · 4500 нит · IP65",
}

function seed(): SiteContent {
  return {
    settings: DEFAULT_SETTINGS,
    hero: { ...DEFAULT_HERO },
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
  const heroRaw = raw.hero
  const hero: HomeHero = heroRaw
    ? {
        image: heroRaw.image?.trim() || base.hero.image,
        imageDark: String(heroRaw.imageDark ?? "").trim(),
        title: heroRaw.title?.trim() || base.hero.title,
        caption: heroRaw.caption?.trim() || base.hero.caption,
      }
    : { ...base.hero }
  return {
    settings,
    hero: {
      ...hero,
      image: toDisplayImageUrl(hero.image),
      imageDark: toDisplayImageUrl(hero.imageDark),
    },
    products: (raw.products ?? base.products).map((p) => ({
      ...p,
      hidden: Boolean(p.hidden),
      image: toDisplayImageUrl(p.image),
    })),
    projects: (raw.projects ?? base.projects).slice(0, 3).map((p) => ({
      ...p,
      showOnHome: true,
      image: toDisplayImageUrl(p.image),
    })),
  }
}

async function readBlob(): Promise<SiteContent | null> {
  if (!useRemoteBlob()) return null
  try {
    const text = await readBlobText(BLOB_KEY)
    if (!text) return null
    return normalize(JSON.parse(text))
  } catch {
    return null
  }
}

async function writeBlob(content: SiteContent) {
  if (!hasBlobToken()) return false
  try {
    await putBlob(BLOB_KEY, JSON.stringify(content, null, 2), {
      access: "private",
      contentType: "application/json",
      cacheControlMaxAge: 60,
    })
    return true
  } catch (e) {
    console.error("site.json blob write failed", e)
    return false
  }
}

let mem: SiteContent | null = null
let memAt = 0
let inflight: Promise<SiteContent> | null = null

// Each serverless instance on Vercel keeps its own module-scope cache, so a
// write from one function invocation never invalidates the cache in another
// (e.g. an admin API route vs. a public page). A short TTL keeps reads fast
// within a single request/instance while still picking up edits quickly
// instead of only after a cold start / redeploy.
const CACHE_TTL_MS = 5_000

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
  if (mem && Date.now() - memAt < CACHE_TTL_MS) return mem
  if (!inflight) {
    inflight = loadSite()
      .then((data) => {
        mem = data
        memAt = Date.now()
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
  memAt = Date.now()
  if (useRemoteBlob()) {
    const blobOk = await writeBlob(next)
    if (!blobOk) {
      throw new Error(
        "Не удалось сохранить в Blob. Проверьте токен без кавычек, что хранилище привязано к проекту, и сделайте Redeploy."
      )
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

export async function getHomeHero(): Promise<HomeHero> {
  return (await readSite()).hero
}

export async function saveUploadedFile(file: File, folder: string) {
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "")
  const safeExt = ["png", "jpg", "jpeg", "webp", "gif"].includes(ext) ? ext : "png"
  const name = `${folder}-${Date.now()}.${safeExt}`
  const bytes = Buffer.from(await file.arrayBuffer())

  if (useRemoteBlob() || process.env.CMS_USE_BLOB === "1") {
    const uploaded = await putBlob(`cms/uploads/${name}`, bytes, {
      access: "public",
      contentType: file.type || "image/png",
    })
    return uploaded.url
  }

  const rel = `/uploads/${name}`
  const dest = path.join(process.cwd(), "public", "uploads", name)
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, bytes)
  return rel
}
