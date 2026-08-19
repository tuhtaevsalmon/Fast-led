"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
import { formatMoney } from "@/lib/format"
import { cartCount, cartTotal, useCart } from "@/store/cart-store"
import { OrderForm } from "@/components/order-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useState } from "react"

export function CartSheet() {
  const { items, cartOpen, setCartOpen, setQty, removeItem, clear } =
    useCart()
  const [sent, setSent] = useState(false)
  const total = cartTotal(items)

  return (
    <Sheet
      open={cartOpen}
      onOpenChange={(open) => {
        setCartOpen(open)
        if (!open) setSent(false)
      }}
    >
      <SheetContent className="w-full max-w-none pb-[env(safe-area-inset-bottom)] sm:max-w-md lg:max-w-lg" side="right">
        <SheetHeader className="border-b">
          <SheetTitle className="text-lg font-semibold">Корзина</SheetTitle>
          <SheetDescription>
            {cartCount(items) === 0
              ? "Пока пусто."
              : `${cartCount(items)} · ${formatMoney(total)}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-2">
          {sent ? (
            <p className="py-8 text-sm leading-7 text-muted-foreground">
              Заявка отправлена. Менеджер свяжется в рабочее время.
            </p>
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Добавьте экраны из каталога.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="border-b pb-4">
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
                  <p className="text-sm">
                    {formatMoney(item.qty * item.pricePerUnitTjs)}
                  </p>
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
                onSubmit={() => {
                  setSent(true)
                  clear()
                }}
              />
            </>
          ) : null}
        </div>

        <SheetFooter>
          <Button variant="ghost" onClick={() => setCartOpen(false)}>
            Закрыть
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
