import type { Metadata } from "next"
import { CatalogView } from "@/components/catalog/catalog-view"
import { getPublicProducts } from "@/lib/content/store"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Каталог LED-экранов — Fast LED",
  description:
    "Каталог светодиодных экранов Absen, Unilumin, Leyard. Indoor, outdoor, прозрачные и гибкие модели. Цены в TJS, поставка и монтаж в Душанбе.",
  alternates: { canonical: "/catalog" },
}

export default async function CatalogPage() {
  const products = await getPublicProducts()
  return (
    <div className="page-shell py-8 sm:py-12 lg:py-16">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Каталог</h1>
      <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
        Реальные линейки Absen, Unilumin и Leyard. Цены — поставка и монтаж в Таджикистане, TJS.
      </p>
      <div className="mt-8 sm:mt-10">
        <CatalogView products={products} />
      </div>
    </div>
  )
}
