import type { SiteSettings } from "@/lib/types"

export function phoneDigits(settings: SiteSettings) {
  let digits = (settings.phone || settings.whatsapp || settings.phoneTel).replace(/\D/g, "")
  if (digits.length === 9) digits = `992${digits}`
  return digits
}

export function whatsappUrl(settings: SiteSettings) {
  return `https://wa.me/${phoneDigits(settings)}`
}

export function instagramUrl(settings: SiteSettings) {
  const value = settings.instagram.trim()
  if (value.startsWith("http")) return value
  const handle = value.replace(/^@/, "")
  return `https://www.instagram.com/${handle}`
}

export function instagramLabel(settings: SiteSettings) {
  const value = settings.instagram.trim()
  if (value.startsWith("http")) {
    return value.replace(/https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")
  }
  return value.replace(/^@/, "")
}

export function telHref(settings: SiteSettings) {
  const digits = phoneDigits(settings)
  return digits ? `tel:+${digits}` : "tel:"
}

export type LeadPayload = {
  name: string
  city: string
  install: boolean
}

export function leadText(data: LeadPayload) {
  return [
    "Заявка Fast LED",
    `Имя: ${data.name}`,
    `Город: ${data.city}`,
    `Монтаж: ${data.install ? "да, под ключ" : "нет, только экраны"}`,
  ].join("\n")
}

export function openWhatsApp(settings: SiteSettings, text: string) {
  const url = `${whatsappUrl(settings)}?text=${encodeURIComponent(text)}`
  const popup = window.open(url, "_blank", "noopener,noreferrer")
  if (!popup) window.location.assign(url)
}
