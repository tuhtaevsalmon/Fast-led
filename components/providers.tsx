"use client"

import { useEffect } from "react"
import { ThemeProvider } from "next-themes"
import { useCart } from "@/store/cart-store"

function CartHydrate() {
  useEffect(() => {
    void useCart.persist.rehydrate()
  }, [])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <CartHydrate />
      {children}
    </ThemeProvider>
  )
}
