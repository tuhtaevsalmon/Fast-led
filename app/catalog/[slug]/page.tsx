import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { PRODUCTS, getProduct, CATEGORY_LABEL } from "@/lib/products"
import { formatPitch } from "@/lib/format"
import { ProductActions } from "@/components/catalog/product-actions"
import { LedPreview } from "@/components/led-preview"

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: "Каталог" }
  return {
    title: `${product.name} — Fast LED`,
    description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const specs = [
    { value: formatPitch(product.pitch), label: "Pixel Pitch" },
    { value: `${product.brightness}`, label: "Nit brightness" },
    { value: product.ipRating, label: "Protection" },
    { value: `${product.powerPerM2}`, label: "Вт / м²" },
    {
      value: `${product.cabinetMm[0]}×${product.cabinetMm[1]}`,
      label: "Кабинет, мм",
    },
    {
      value: `${product.cabinetResolution[0]}×${product.cabinetResolution[1]}`,
      label: "Разрешение",
    },
  ]

  return (
    <div className="page-shell grid gap-8 py-8 sm:gap-12 sm:py-12 lg:grid-cols-2 lg:gap-16 lg:py-16 xl:gap-20">
      <LedPreview
        src={product.image}
        alt={product.name}
        className="aspect-[4/3] lg:aspect-[4/5]"
        fit="contain"
        priority
      />
      <div>
        <Link href="/catalog" className="text-sm text-muted-foreground hover:text-foreground">
          Каталог
        </Link>
        <p className="mt-8 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          {CATEGORY_LABEL[product.category]}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{product.name}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {product.inStock ? "В наличии в Душанбе" : "Под заказ"}
          {product.hit ? " · Хит" : ""}
        </p>
        <p className="mt-6 max-w-lg text-sm leading-8 text-muted-foreground">{product.description}</p>
        <div className="mt-10 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-3">
          {specs.map((s) => (
            <div key={s.label}>
              <p className="text-xl tracking-tight text-primary sm:text-2xl">{s.value}</p>
              <p className="mt-1 text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <ProductActions product={product} />
      </div>
    </div>
  )
}
