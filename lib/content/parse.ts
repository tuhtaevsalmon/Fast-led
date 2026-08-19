import type { LedCategory, Product, Project } from "@/lib/types"

function slugify(name: string) {
  const s = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return s || `model-${Date.now()}`
}

export function parseProduct(body: Record<string, unknown>, current?: Product): Product {
  const name = String(body.name ?? current?.name ?? "Новая модель")
  const slugRaw = String(body.slug ?? current?.slug ?? slugify(name))
  const unit = body.unit === "cabinet" || body.unit === "m2"
    ? body.unit
    : current?.unit ?? "m2"
  return {
    id: current?.id ?? `p-${Date.now()}`,
    slug: slugRaw || slugify(name),
    name,
    category: (body.category as LedCategory) ?? current?.category ?? "indoor",
    pitch: Number(body.pitch ?? current?.pitch ?? 2),
    brightness: Number(body.brightness ?? current?.brightness ?? 1000),
    ipRating: (body.ipRating as Product["ipRating"]) ?? current?.ipRating ?? "IP31",
    cabinetMm: [
      Number(body.cabinetW ?? current?.cabinetMm[0] ?? 500),
      Number(body.cabinetH ?? current?.cabinetMm[1] ?? 500),
    ],
    cabinetResolution: [
      Number(body.resW ?? current?.cabinetResolution[0] ?? 128),
      Number(body.resH ?? current?.cabinetResolution[1] ?? 128),
    ],
    powerPerM2: Number(body.powerPerM2 ?? current?.powerPerM2 ?? 400),
    pricePerM2Tjs: Number(body.pricePerM2Tjs ?? current?.pricePerM2Tjs ?? 0),
    inStock: Boolean(body.inStock ?? current?.inStock ?? true),
    hit: Boolean(body.hit ?? current?.hit ?? false),
    hidden: Boolean(body.hidden ?? current?.hidden ?? false),
    unit,
    description: String(body.description ?? current?.description ?? ""),
    hue: current?.hue ?? 210,
    image: String(body.image ?? current?.image ?? ""),
  }
}

export function parseProject(body: Record<string, unknown>, current?: Project): Project {
  return {
    id: current?.id ?? `pr-${Date.now()}`,
    title: String(body.title ?? current?.title ?? "Новый проект"),
    city: String(body.city ?? current?.city ?? "Душанбе"),
    area: Number(body.area ?? current?.area ?? 0),
    pitch: body.pitch === "" || body.pitch == null ? current?.pitch : Number(body.pitch),
    place: String(body.place ?? current?.place ?? ""),
    image: String(body.image ?? current?.image ?? ""),
    showOnHome: true,
  }
}
