import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { getPublicProducts } from "@/lib/content/store"

// Product list comes from the CMS (Blob storage), so the sitemap is
// generated per-request rather than cached at build time.
export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublicProducts()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/catalog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contacts`, changeFrequency: "monthly", priority: 0.5 },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/catalog/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes]
}
