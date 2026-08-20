"use client"

import { MapPin, Phone } from "lucide-react"
import { ContactForm } from "@/app/(shop)/contacts/form"
import { Logo } from "@/components/logo"
import { Reveal } from "@/components/motion/reveal"
import type { SiteSettings } from "@/lib/types"
import { instagramLabel, instagramUrl } from "@/lib/content/urls"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
    </svg>
  )
}

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer id="lead" className="mt-auto scroll-mt-20 border-t bg-white dark:bg-background">
      <Reveal className="page-shell grid gap-10 py-8 lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:py-10">
        <div className="flex h-full min-w-0 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Logo />
            <span className="hidden h-4 w-px bg-black/10 sm:block dark:bg-white/15" />
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {settings.address}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-3.5 shrink-0" />
              {settings.phone}
            </p>
            <a
              href={instagramUrl(settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm leading-none text-muted-foreground hover:text-foreground"
            >
              <InstagramIcon className="block size-3.5 shrink-0" />
              <span>{instagramLabel(settings)}</span>
            </a>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            LED-экраны под ключ. Шоурум в Душанбе — продажа, монтаж и сервис по
            Таджикистану, гарантия до 3 лет.
          </p>
          <div className="relative mt-auto min-h-56 flex-1 overflow-hidden rounded-xl ring-1 ring-black/5">
            <iframe
              title="Карта Душанбе"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              src="https://maps.google.com/maps?q=Rudaki%20Avenue%20Dushanbe&t=&z=14&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </div>
        <div className="flex h-full min-h-0 flex-col">
          <h2 className="text-lg font-semibold tracking-tight">Заявка</h2>
          <p className="mt-1 mb-4 text-xs text-muted-foreground">
            Имя, город и монтаж.
          </p>
          <div className="flex min-h-0 flex-1 flex-col">
            <ContactForm compact alignBottom settings={settings} />
          </div>
        </div>
      </Reveal>
      <div className="border-t py-3 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Fast LED
      </div>
    </footer>
  )
}
