"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import { formatMoney } from "@/lib/format"
import { cartCount, cartTotal, useCart } from "@/store/cart-store"
import { OrderForm } from "@/components/order-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { SiteSettings } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

export function CartSheet({ settings }: { settings: SiteSettings }) {
  const { items, cartOpen, setCartOpen, setQty, removeItem, clear } = useCart()
  const [sent, setSent] = useState(false)
  const total = cartTotal(items)
  const count = cartCount(items)

  return (
    <Dialog
      open={cartOpen}
      onOpenChange={(open) => {
        setCartOpen(open)
        if (!open) setSent(false)
      }}
    >
      <DialogContent
        className="flex max-h-[min(90vh,40rem)] w-full max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
        showCloseButton
      >
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle className="text-lg font-semibold">Корзина</DialogTitle>
          <DialogDescription>
            {count === 0 ? "Пока пусто." : `${count} · ${formatMoney(total)}`}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {sent ? (
            <p className="py-8 text-sm leading-7 text-muted-foreground">
              Заявка отправлена. Менеджер свяжется в WhatsApp.
            </p>
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Добавьте экраны из каталога.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.meta}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeItem(item.id)}
                    aria-label="Удалить"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setQty(item.id, item.qty - 1)}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setQty(item.id, item.qty + 1)}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                  <p className="text-sm">{formatMoney(item.qty * item.pricePerUnitTjs)}</p>
                </div>
              </div>
            ))
          )}

          {!sent && items.length > 0 ? (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Итого</span>
                <span className="text-2xl font-semibold tracking-tight">
                  {formatMoney(total)}
                </span>
              </div>
              <OrderForm
                settings={settings}
                extraText={() => {
                  const lines = items.map(
                    (item) =>
                      `${item.name} × ${item.qty} ${item.unitLabel} — ${formatMoney(item.qty * item.pricePerUnitTjs)}`
                  )
                  return ["Заказ:", ...lines, "", `Итого: ${formatMoney(total)}`].join("\n")
                }}
                onSubmit={() => {
                  setSent(true)
                  clear()
                }}
              />
            </>
          ) : null}
        </div>

        <DialogFooter className="mx-0 mb-0">
          <Button variant="ghost" onClick={() => setCartOpen(false)}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
