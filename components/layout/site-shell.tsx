import { CartSheet } from "@/components/cart/cart-sheet"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { QuoteDialog } from "@/components/quote-dialog"
import { readSite } from "@/lib/content/store"

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const site = await readSite()
  const settings = site.settings
  const products = site.products.filter((p) => !p.hidden)
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
