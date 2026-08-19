import Link from "next/link"
import { getAllProducts } from "@/lib/content/store"
import { formatMoney } from "@/lib/format"
import { Button } from "@/components/ui/button"

export default async function AdminProductsPage() {
  const products = await getAllProducts()
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Товары</h1>
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
  )
}
