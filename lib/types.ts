export type LedCategory =
  | "indoor"
  | "outdoor"
  | "transparent"
  | "rental"
  | "flexible"

export type PixelPitch =
  | 1.2
  | 1.5
  | 1.8
  | 2
  | 2.5
  | 2.6
  | 3
  | 3.9
  | 4
  | 5
  | 6.6
  | 10

export type ContactChannel = "call" | "whatsapp" | "telegram"

export type Product = {
  id: string
  slug: string
  name: string
  category: LedCategory
  pitch: number
  brightness: number
  ipRating: "IP31" | "IP54" | "IP65" | "IP67"
  cabinetMm: [number, number]
  cabinetResolution: [number, number]
  powerPerM2: number
  pricePerM2Tjs: number
  inStock: boolean
  hit: boolean
  hidden: boolean
  unit: "m2" | "cabinet"
  description: string
  hue: number
  image: string
}

export type Project = {
  id: string
  title: string
  city: string
  area: number
  pitch?: number
  place: string
  image: string
  showOnHome: boolean
}

export type SiteSettings = {
  phone: string
  phoneTel: string
  whatsapp: string
  instagram: string
  address: string
}

/** Big product card on the homepage hero */
export type HomeHero = {
  image: string
  /** Dark-theme photo. Empty = same image for both themes. */
  imageDark: string
  title: string
  caption: string
}

export type SiteContent = {
  settings: SiteSettings
  hero: HomeHero
  products: Product[]
  projects: Project[]
}

export type CartItem = {
  id: string
  kind: "product" | "custom"
  productId?: string
  name: string
  unitLabel: string
  qty: number
  pricePerUnitTjs: number
  meta: string
}

export type QuoteRequest = {
  name: string
  phone: string
  city: string
  install: boolean
  channel: ContactChannel
}
