"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PRODUCTS } from "@/lib/products"
import { ProductCard } from "@/components/catalog/product-card"
import { cn } from "@/lib/utils"

export function ProductCarousel() {
  const scroller = useRef<HTMLDivElement>(null)
  const items = PRODUCTS.filter((p) => p.hit)

  const move = (dir: -1 | 1) => {
    const el = scroller.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("[data-slide]")
    const step = card ? card.offsetWidth + 24 : 300
    el.scrollBy({ left: dir * step, behavior: "smooth" })
  }

  return (
    <div className="relative">
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((p) => (
          <div
            key={p.id}
            data-slide
            className="w-[min(78vw,280px)] shrink-0 snap-start sm:w-[300px] lg:w-[320px]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <Arrow dir={-1} onClick={() => move(-1)} />
      <Arrow dir={1} onClick={() => move(1)} />
    </div>
  )
}

function Arrow({ dir, onClick }: { dir: -1 | 1; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={dir === -1 ? "Назад" : "Вперёд"}
      onClick={onClick}
      className={cn(
        "hidden md:flex absolute top-1/2 z-10 size-10 -translate-y-1/2 items-center justify-center rounded-full sm:size-11",
        "border border-black/5 bg-white/75 text-foreground/70 shadow-[0_8px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl",
        "transition duration-200 ease-out hover:bg-white hover:text-foreground hover:shadow-[0_10px_32px_rgba(15,23,42,0.12)]",
        "active:scale-[0.97] dark:border-white/10 dark:bg-background/75 dark:hover:bg-background",
        dir === -1 ? "left-0 sm:-left-3 lg:-left-5" : "right-0 sm:-right-3 lg:-right-5"
      )}
    >
      {dir === -1 ? (
        <ChevronLeft className="size-5" strokeWidth={1.6} />
      ) : (
        <ChevronRight className="size-5" strokeWidth={1.6} />
      )}
    </button>
  )
}
