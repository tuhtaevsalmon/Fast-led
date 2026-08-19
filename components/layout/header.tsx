"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Phone, ShoppingBag } from "lucide-react"
import { cartCount, useCart } from "@/store/cart-store"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import type { SiteSettings } from "@/lib/types"
import { telHref, whatsappUrl } from "@/lib/content/urls"

const NAV = [
  { href: "/", label: "Главная" },
  { href: "/#catalog", label: "Каталог" },
  { href: "/#projects", label: "Проекты" },
  { href: "/#about", label: "О нас" },
  { href: "/#lead", label: "Заявка" },
]

const SECTION_IDS = ["catalog", "projects", "about", "lead"] as const

function sectionFromScroll() {
  if (typeof window === "undefined") return ""
  const scrolled = window.scrollY + window.innerHeight
  const pageHeight = document.documentElement.scrollHeight
  if (scrolled >= pageHeight - 64) return "#lead"
  if (window.scrollY < 100) return ""
  let current = ""
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= 120) current = `#${id}`
  }
  return current
}

function navActive(pathname: string, href: string, section: string) {
  if (href === "/#catalog" && pathname.startsWith("/catalog")) return true
  if (href === "/#lead" && pathname.startsWith("/contacts")) return true
  if (pathname !== "/") return false
  if (href === "/") return section === ""
  return href === `/${section}`
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname()
  const items = useCart((s) => s.items)
  const setCartOpen = useCart((s) => s.setCartOpen)
  const [menuOpen, setMenuOpen] = useState(false)
  const [section, setSection] = useState("")
  const count = cartCount(items)

  useEffect(() => {
    if (pathname !== "/") {
      setSection("")
      return
    }
    const sync = () => setSection(sectionFromScroll())
    sync()
    window.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("hashchange", sync)
    return () => {
      window.removeEventListener("scroll", sync)
      window.removeEventListener("hashchange", sync)
    }
  }, [pathname])

  const go = (href: string) => {
    if (href === "/") {
      setSection("")
      if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (href.startsWith("/#")) {
      const id = href.slice(2)
      setSection(`#${id}`)
      if (pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
      }
    }
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-background/75">
      <div className="page-shell grid h-14 grid-cols-[1fr_auto] items-center gap-3 sm:h-16 lg:h-[4.25rem] lg:grid-cols-[1fr_auto_1fr]">
        <Logo className="justify-self-start" />

        <nav className="hidden items-center justify-center gap-2 lg:flex xl:gap-3">
          {NAV.map((item) => {
            const active = navActive(pathname, item.href, section)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => go(item.href)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground active:bg-muted/80 xl:px-3.5",
                  active && "bg-muted font-medium text-primary"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center justify-self-end gap-0.5 sm:gap-1">
          <a
            href={telHref(settings)}
            className="hidden items-center gap-1.5 rounded-full px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground xl:flex"
          >
            <Phone className="size-3.5" />
            {settings.phone}
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-[#25D366]"
            nativeButton={false}
            render={<a href={whatsappUrl(settings)} target="_blank" rel="noopener noreferrer" />}
            aria-label="WhatsApp"
          >
            <WhatsAppIcon className="size-4" />
          </Button>
          <ThemeToggle className="rounded-full" />
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            onClick={() => setCartOpen(true)}
            aria-label="Корзина"
          >
            <ShoppingBag className="size-4" />
            {count > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                {count > 9 ? "9+" : count}
              </span>
            ) : null}
          </Button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="rounded-full lg:hidden" />}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(20rem,90vw)]">
              <SheetHeader>
                <SheetTitle>Fast LED</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {NAV.map((item) => {
                  const active = navActive(pathname, item.href, section)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => go(item.href)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-base transition-colors duration-200 active:bg-muted",
                        active && "bg-muted font-medium text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                <a href={telHref(settings)} className="mt-3 flex items-center gap-2 px-3 py-2 text-sm">
                  <Phone className="size-4" />
                  {settings.phone}
                </a>
                <a
                  href={whatsappUrl(settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#25D366]"
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
