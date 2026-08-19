"use client"

import type { Product, SiteSettings } from "@/lib/types"
import { useCart } from "@/store/cart-store"
import { OrderForm } from "@/components/order-form"
import { formatMoney } from "@/lib/format"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

export function QuoteDialog({
  products,
  settings,
}: {
  products: Product[]
  settings: SiteSettings
}) {
  const quoteOpen = useCart((s) => s.quoteOpen)
  const quoteProductId = useCart((s) => s.quoteProductId)
  const setQuoteOpen = useCart((s) => s.setQuoteOpen)
  const [sent, setSent] = useState(false)
  const product = products.find((p) => p.id === quoteProductId)

  return (
    <Dialog
      open={quoteOpen}
      onOpenChange={(open) => {
        setQuoteOpen(open)
        if (!open) setSent(false)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Запросить коммерческое предложение</DialogTitle>
          <DialogDescription>
            {product
              ? `${product.name} — менеджер подготовит КП с доставкой в Душанбе.`
              : "Оставьте контакты — подготовим КП."}
          </DialogDescription>
        </DialogHeader>
        {sent ? (
          <p className="p-2 text-sm text-muted-foreground">Заявка принята. Свяжемся выбранным способом.</p>
        ) : (
          <OrderForm
            settings={settings}
            submitLabel="Отправить заявку на КП"
            extraText={() =>
              product ? `Модель: ${product.name}\n${formatMoney(product.pricePerM2Tjs)} / ${product.unit === "cabinet" ? "кабинет" : "м²"}` : ""
            }
            onSubmit={() => setSent(true)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
