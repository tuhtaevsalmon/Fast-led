"use client"

import { useMemo, useState, type ReactNode } from "react"
import {
  CATEGORY_LABEL,
  brightnessBounds,
  priceBounds,
} from "@/lib/products"
import type { LedCategory, Product } from "@/lib/types"
import { ProductCard } from "@/components/catalog/product-card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { sliderRange } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/format"
import { SlidersHorizontal } from "lucide-react"

function ruModels(n: number) {
  const n10 = n % 10
  const n100 = n % 100
  if (n10 === 1 && n100 !== 11) return "модель"
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return "модели"
  return "моделей"
}

const CATEGORIES: Array<LedCategory | "all"> = [
  "all",
  "indoor",
  "outdoor",
  "transparent",
  "rental",
  "flexible",
]

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-[transform,background-color,color,border-color] duration-200 ease-out active:scale-[0.97]",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground active:bg-muted"
      )}
    >
      {children}
    </button>
  )
}

export function CatalogView({
  products,
  featuredOnly = false,
}: {
  products: Product[]
  featuredOnly?: boolean
}) {
  const bounds = priceBounds(products)
  const nits = brightnessBounds(products)
  const pitchOptions = [...new Set(products.map((p) => p.pitch))].sort((a, b) => a - b)
  const [category, setCategory] = useState<LedCategory | "all">("all")
  const [pitches, setPitches] = useState<number[]>([])
  const [brightness, setBrightness] = useState<[number, number]>([nits.min, nits.max])
  const [price, setPrice] = useState<[number, number]>([bounds.min, bounds.max])
  const [filtersOpen, setFiltersOpen] = useState(false)

  const pricePresets: Array<{ label: string; range: [number, number] }> = [
    { label: "Любая", range: [bounds.min, bounds.max] },
    { label: "До 5 тыс.", range: [bounds.min, 5000] },
    { label: "5–10 тыс.", range: [5000, 10000] },
    { label: "От 10 тыс.", range: [10000, bounds.max] },
  ]

  const list = useMemo(() => {
    return products.filter((p) => {
      if (featuredOnly && !p.hit) return false
      if (category !== "all" && p.category !== category) return false
      if (pitches.length && !pitches.includes(p.pitch)) return false
      if (p.brightness < brightness[0] || p.brightness > brightness[1]) return false
      if (p.pricePerM2Tjs < price[0] || p.pricePerM2Tjs > price[1]) return false
      return true
    })
  }, [category, pitches, brightness, price, featuredOnly, products])

  const dirty =
    category !== "all" ||
    pitches.length > 0 ||
    brightness[0] !== nits.min ||
    brightness[1] !== nits.max ||
    price[0] !== bounds.min ||
    price[1] !== bounds.max

  const reset = () => {
    setCategory("all")
    setPitches([])
    setBrightness([nits.min, nits.max])
    setPrice([bounds.min, bounds.max])
  }

  const priceActive = (range: [number, number]) =>
    price[0] === range[0] && price[1] === range[1]

  if (featuredOnly) {
    return (
      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 xl:grid-cols-4">
        {list.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Найдено{" "}
          <span className="font-medium text-foreground">{list.length}</span>{" "}
          {ruModels(list.length)}
        </p>
        <Button
          type="button"
          variant="outline"
          className="h-10 px-4 sm:h-9"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <SlidersHorizontal className="size-3.5" />
          Фильтры
          {dirty ? (
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
          ) : null}
        </Button>
      </div>

      {filtersOpen ? (
      <div className="mb-8 rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">Фильтры</p>
          {dirty ? (
            <button
              type="button"
              onClick={reset}
              className="text-xs text-primary hover:underline active:opacity-70"
            >
              Сбросить
            </button>
          ) : null}
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Категория</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                  {c === "all" ? "Все" : CATEGORY_LABEL[c].split(" (")[0]}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Шаг пикселя</p>
            <div className="flex flex-wrap gap-2">
              {pitchOptions.map((p) => (
                <Chip
                  key={p}
                  active={pitches.includes(p)}
                  onClick={() =>
                    setPitches((prev) =>
                      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
                    )
                  }
                >
                  {`P${p}`}
                </Chip>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
            <div>
              <div className="mb-3 flex items-end justify-between gap-3">
                <p className="text-xs font-medium text-muted-foreground">Цена за м²</p>
                <p className="text-sm font-semibold tabular-nums">
                  {formatMoney(price[0])} – {formatMoney(price[1])}
                </p>
              </div>
              <Slider
                min={bounds.min}
                max={bounds.max}
                step={50}
                value={price}
                onValueChange={(v) => setPrice(sliderRange(v))}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {pricePresets.map((preset) => (
                  <Chip
                    key={preset.label}
                    active={priceActive(preset.range)}
                    onClick={() => setPrice(preset.range)}
                  >
                    {preset.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-end justify-between gap-3">
                <p className="text-xs font-medium text-muted-foreground">Яркость</p>
                <p className="text-sm font-semibold tabular-nums">
                  {brightness[0].toLocaleString("ru-RU")}–{brightness[1].toLocaleString("ru-RU")} нит
                </p>
              </div>
              <Slider
                min={nits.min}
                max={nits.max}
                step={50}
                value={brightness}
                onValueChange={(v) => setBrightness(sliderRange(v))}
              />
            </div>
          </div>
        </div>
      </div>
      ) : null}

      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 xl:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {list.length === 0 ? (
          <div className="col-span-full rounded-2xl border py-16 text-center">
            <p className="text-muted-foreground">Нет позиций с такими параметрами.</p>
            <Button variant="outline" className="mt-4" onClick={reset}>
              Сбросить фильтры
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
