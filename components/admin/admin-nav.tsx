"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/projects", label: "Проекты" },
  { href: "/admin/settings", label: "Контакты" },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  if (pathname === "/admin/login") return null

  return (
    <header className="border-b bg-white dark:bg-background">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm font-semibold">Fast LED · Админка</p>
        <nav className="flex flex-wrap items-center gap-1">
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                pathname.startsWith(item.href) && "bg-muted font-medium text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" })
              router.push("/admin/login")
              router.refresh()
            }}
          >
            Выйти
          </Button>
        </nav>
      </div>
    </header>
  )
}
