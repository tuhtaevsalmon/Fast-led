"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { formatPitch } from "@/lib/format"
import { PRODUCTS } from "@/lib/products"
import type { CartItem } from "@/lib/types"

function syncCartItem(item: CartItem): CartItem | null {
  if (item.kind !== "product" || !item.productId) return item
  const product = PRODUCTS.find((p) => p.id === item.productId)
  if (!product) return null
  return {
    ...item,
    name: product.name,
    unitLabel: product.unit === "cabinet" ? "кабинет" : "м²",
    pricePerUnitTjs: product.pricePerM2Tjs,
    meta: `${formatPitch(product.pitch)} · ${product.ipRating}`,
  }
}

type CartState = {
  items: CartItem[]
  cartOpen: boolean
  quoteOpen: boolean
  quoteProductId?: string
  setCartOpen: (open: boolean) => void
  setQuoteOpen: (open: boolean, productId?: string) => void
  addItem: (item: Omit<CartItem, "id"> & { id?: string }) => void
  removeItem: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartOpen: false,
      quoteOpen: false,
      setCartOpen: (cartOpen) => set({ cartOpen }),
      setQuoteOpen: (quoteOpen, quoteProductId) =>
        set({ quoteOpen, quoteProductId }),
      addItem: (item) => {
        const id = item.id ?? crypto.randomUUID()
        const existing = get().items.find(
          (i) => i.kind === "product" && i.productId && i.productId === item.productId
        )
        if (item.kind === "product" && existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id ? { ...i, qty: i.qty + item.qty } : i
            ),
            cartOpen: true,
          })
          return
        }
        set({
          items: [...get().items, { ...item, id }],
          cartOpen: true,
        })
      },
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      setQty: (id, qty) => {
        if (qty < 1) {
          set({ items: get().items.filter((i) => i.id !== id) })
          return
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "led-dushanbe-cart",
      partialize: (s) => ({ items: s.items }),
      merge: (persisted, current) => {
        const stored = persisted as Partial<CartState> | undefined
        const items = (stored?.items ?? [])
          .map(syncCartItem)
          .filter((item): item is CartItem => item !== null)
        return { ...current, ...stored, items }
      },
    }
  )
)

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.qty, 0)
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.qty * i.pricePerUnitTjs, 0)
}
