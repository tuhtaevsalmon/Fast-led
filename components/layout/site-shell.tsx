import { CartSheet } from "@/components/cart/cart-sheet"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { QuoteDialog } from "@/components/quote-dialog"
import { getPublicProducts, getSettings } from "@/lib/content/store"

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [settings, products] = await Promise.all([getSettings(), getPublicProducts()])
  return (
    <div className="flex min-h-full flex-col bg-background">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <CartSheet settings={settings} />
      <QuoteDialog products={products} settings={settings} />
    </div>
  )
}
