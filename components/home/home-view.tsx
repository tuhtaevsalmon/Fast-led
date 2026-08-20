"use client"

import Image from "next/image"
import Link from "next/link"
import { ProductCarousel } from "@/components/catalog/product-carousel"
import { LedPreview } from "@/components/led-preview"
import {
  CountUp,
  Parallax,
  PowerOn,
  Reveal,
  StaggerItem,
} from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import type { HomeHero, Product, Project } from "@/lib/types"

const BRANDS = [
  {
    name: "Absen",
    src: "/brands/absen-w.png",
    width: 150,
    height: 50,
    className: "h-[22px] w-auto sm:h-[26px]",
  },
  {
    name: "Unilumin",
    src: "/brands/unilumin-clear.png",
    width: 148,
    height: 27,
    className: "h-[14px] w-auto sm:h-[18px]",
  },
  {
    name: "Leyard",
    src: "/brands/leyard.png",
    width: 170,
    height: 15,
    className: "h-[9px] w-auto sm:h-[13px]",
  },
  {
    name: "NovaStar",
    src: "/brands/novastar.png",
    width: 156,
    height: 28,
    className: "h-[25px] w-auto sm:h-[29px]",
  },
]


const HERO_STATS = [
  { kind: "count" as const, value: 100, suffix: "+", label: "объектов" },
  { kind: "count" as const, value: 3, suffix: " года", label: "гарантии" },
  { kind: "text" as const, text: "24–72 ч", label: "доставка" },
]

export function HomeView({
  products,
  projects,
  hero,
}: {
  products: Product[]
  projects: Project[]
  hero: HomeHero
}) {
  return (
    <div>
      <section className="page-shell grid items-start gap-8 pt-10 pb-8 sm:pt-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12 lg:pt-16 lg:pb-12 xl:gap-16 xl:pt-20">
        <div className="text-center lg:text-left">
          <StaggerItem index={0}>
            <p className="text-sm text-primary">Fast LED · Душанбе</p>
          </StaggerItem>
          <StaggerItem index={1}>
            <h1 className="mt-3 text-[2rem] leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] xl:text-6xl">
              LED-экраны под ключ
            </h1>
          </StaggerItem>
          <StaggerItem index={2}>
            <p className="mx-auto mt-5 max-w-md text-[15px] leading-7 text-muted-foreground lg:mx-0 lg:max-w-lg">
              Продажа, монтаж и сервис в Таджикистане. Гарантия до 3 лет.
            </p>
          </StaggerItem>
          <StaggerItem index={3}>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Button
                className="h-12 w-full px-7 sm:w-auto"
                nativeButton={false}
                render={<Link href="#lead" />}
              >
                Оставить заявку
              </Button>
              <Button
                variant="outline"
                className="h-12 w-full px-7 sm:w-auto"
                nativeButton={false}
                render={<Link href="#catalog" />}
              >
                Смотреть модели
              </Button>
            </div>
          </StaggerItem>
          <StaggerItem index={4}>
            <div className="mx-auto mt-10 flex max-w-md items-start justify-between gap-4 border-t border-black/5 pt-8 dark:border-white/10 lg:mx-0">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="min-w-0 flex-1 text-center">
                  <p className="text-lg font-semibold tracking-tight sm:text-2xl">
                    {stat.kind === "count" ? (
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    ) : (
                      stat.text
                    )}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </StaggerItem>
        </div>
        <StaggerItem index={5} className="w-full">
          <Parallax strength={0.03}>
            <PowerOn>
              <LedPreview
                src={hero.image}
                srcDark={hero.imageDark || undefined}
                alt={hero.title}
                className="aspect-[16/10] w-full lg:aspect-[5/4] xl:aspect-[16/11]"
                caption={hero.title}
                captionHint={hero.caption}
                captionAlways
                fit="cover"
                quality={100}
                unoptimized
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </PowerOn>
          </Parallax>
        </StaggerItem>
      </section>

      <Reveal as="section" className="border-y border-black/5 dark:border-white/10">
        <div className="page-shell flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-7 sm:gap-x-12 sm:py-9 lg:gap-x-16">
          {BRANDS.map((brand) => (
            <div key={brand.name} className="flex h-8 items-center justify-center sm:h-9">
              <Image
                src={brand.src}
                alt={brand.name}
                width={brand.width}
                height={brand.height}
                unoptimized
                className={`object-contain ${brand.className}`}
              />
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal
        as="section"
        id="catalog"
        className="page-shell scroll-mt-20 pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20"
      >
        <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Модели
          </h2>
          <Button
            variant="outline"
            className="h-10 shrink-0 px-4 sm:h-9"
            nativeButton={false}
            render={<Link href="/catalog" />}
          >
            Смотреть весь каталог
          </Button>
        </div>
        <PowerOn>
          <ProductCarousel products={products} />
        </PowerOn>
      </Reveal>

      <Reveal
        as="section"
        id="projects"
        className="page-shell scroll-mt-20 pb-12 sm:pb-16 lg:pb-20"
      >
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Проекты
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {projects.map((p, i) => (
            <StaggerItem key={p.id} index={i} step={90}>
              <article>
                <Parallax strength={0.025}>
                  <PowerOn>
                    <LedPreview
                      src={p.image}
                      alt={p.title}
                      className="aspect-[16/10] lg:aspect-[4/3]"
                    />
                  </PowerOn>
                </Parallax>
                <p className="mt-3 text-sm font-medium">{p.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.city} · {p.area} м²
                </p>
              </article>
            </StaggerItem>
          ))}
        </div>
      </Reveal>

      <Reveal
        as="section"
        id="about"
        className="page-shell scroll-mt-20 grid items-center gap-8 pb-12 sm:pb-16 lg:grid-cols-2 lg:gap-14 lg:pb-20"
      >
        <Parallax strength={0.03}>
          <PowerOn>
            <LedPreview
              src="/led/indoor-2.jpg"
              alt="Шоурум Fast LED"
              className="aspect-[4/3] w-full"
            />
          </PowerOn>
        </Parallax>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            О компании
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-muted-foreground">
            Шоурум Fast LED на проспекте Рудаки. Можно посмотреть кабинеты Absen,
            Unilumin и Leyard вживую — и сразу обсудить монтаж.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              ["Душанбе", "шоурум"],
              ["3 года", "гарантия"],
              ["TJ", "выезд по стране"],
            ].map(([n, l]) => (
              <div key={n}>
                <p className="text-lg font-semibold tracking-tight sm:text-xl">{n}</p>
                <p className="mt-1 text-xs text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}
