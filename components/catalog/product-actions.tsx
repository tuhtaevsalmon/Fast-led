"use client"

import { formatMoney, formatPitch } from "@/lib/format"
import type { Product } from "@/lib/types"
import { useCart } from "@/store/cart-store"
import { Button } from "@/components/ui/button"

export function ProductActions({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)
  const setQuoteOpen = useCart((s) => s.setQuoteOpen)

  return (
    <div className="mt-10 space-y-5">
      <p className="text-3xl font-semibold tracking-tight">
        {formatMoney(product.pricePerM2Tjs)}
        <span className="ml-2 font-sans text-sm text-muted-foreground">
          / {product.unit === "cabinet" ? "кабинет" : "м²"}
        </span>
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          className="h-12 w-full sm:h-11 sm:w-auto sm:px-6"
          onClick={() =>
            addItem({
              kind: "product",
              productId: product.id,
              name: product.name,
              unitLabel: product.unit === "cabinet" ? "кабинет" : "м²",
              qty: 1,
              pricePerUnitTjs: product.pricePerM2Tjs,
              meta: `${formatPitch(product.pitch)} · ${product.ipRating}`,
            })
          }
        >
          В корзину
        </Button>
        <Button variant="outline" className="h-12 w-full sm:h-11 sm:w-auto sm:px-6" onClick={() => setQuoteOpen(true, product.id)}>
          Запросить КП
        </Button>
      </div>
    </div>
  )
}
