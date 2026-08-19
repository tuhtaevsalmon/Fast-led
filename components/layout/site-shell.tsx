import { CartSheet } from "@/components/cart/cart-sheet"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { QuoteDialog } from "@/components/quote-dialog"

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSheet />
      <QuoteDialog />
    </div>
  )
}
