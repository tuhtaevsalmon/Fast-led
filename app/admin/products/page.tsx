import Link from "next/link"
import { getAllProducts, getHomeHero } from "@/lib/content/store"
import { formatMoney } from "@/lib/format"
import { Button } from "@/components/ui/button"

export default async function AdminProductsPage() {
  const [products, hero] = await Promise.all([getAllProducts(), getHomeHero()])
  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Главная · большой блок</h1>
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Link
            href="/admin/products/hero"
            className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/50"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">{hero.title}</p>
              <p className="truncate text-xs text-muted-foreground">{hero.caption}</p>
            </div>
            <span className="shrink-0 text-xs text-primary">Изменить</span>
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">Товары</h2>
          <Button nativeButton={false} render={<Link href="/admin/products/new" />}>
            Добавить
          </Button>
        </div>
        <div className="overflow-hidden rounded-2xl border bg-card">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/admin/products/${p.id}`}
              className="flex items-center justify-between gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-muted/50"
            >
              <div>
                <p className="text-sm font-medium">
                  {p.name}
                  {p.hidden ? (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">скрыт</span>
                  ) : null}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatMoney(p.pricePerM2Tjs)} · {p.inStock ? "в наличии" : "под заказ"}
                </p>
              </div>
              <span className="text-xs text-primary">Изменить</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
