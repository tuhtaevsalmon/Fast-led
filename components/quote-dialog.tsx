"use client"

import { PRODUCTS } from "@/lib/products"
import { useCart } from "@/store/cart-store"
import { OrderForm } from "@/components/order-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

export function QuoteDialog() {
  const quoteOpen = useCart((s) => s.quoteOpen)
  const quoteProductId = useCart((s) => s.quoteProductId)
  const setQuoteOpen = useCart((s) => s.setQuoteOpen)
  const [sent, setSent] = useState(false)
  const product = PRODUCTS.find((p) => p.id === quoteProductId)

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
            submitLabel="Отправить заявку на КП"
            onSubmit={() => setSent(true)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
