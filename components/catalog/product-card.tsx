"use client"

import Link from "next/link"
import { formatMoney, formatPitch } from "@/lib/format"
import type { Product } from "@/lib/types"
import { useCart } from "@/store/cart-store"
import { LedPreview } from "@/components/led-preview"
import { Button } from "@/components/ui/button"

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)

  return (
    <article className="group flex flex-col">
      <Link href={`/catalog/${product.slug}`}>
        <LedPreview
          src={product.image}
          alt={product.name}
          className="aspect-[4/3]"
          fit="contain"
          quality={95}
          label={product.inStock ? "В наличии" : "Под заказ"}
        />
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <Link href={`/catalog/${product.slug}`}>
          <h3 className="text-base font-semibold tracking-tight">{product.name}</h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatPitch(product.pitch)} · {product.brightness} нит
        </p>
        <p className="mt-2 text-sm font-medium">
          {formatMoney(product.pricePerM2Tjs)}
          <span className="font-normal text-muted-foreground">
            {" "}
            / {product.unit === "cabinet" ? "кабинет" : "м²"}
          </span>
        </p>
        <Button
          type="button"
          size="sm"
          className="mt-3 h-10 w-full sm:h-9"
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
      </div>
    </article>
  )
}
