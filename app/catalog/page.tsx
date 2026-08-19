import { CatalogView } from "@/components/catalog/catalog-view"

export default function CatalogPage() {
  return (
    <div className="page-shell py-8 sm:py-12 lg:py-16">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Каталог</h1>
      <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
        Реальные линейки Absen, Unilumin и Leyard. Цены — поставка и монтаж в Таджикистане, TJS.
      </p>
      <div className="mt-8 sm:mt-10">
        <CatalogView />
      </div>
    </div>
  )
}
