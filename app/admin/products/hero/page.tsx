import Link from "next/link"
import { getHomeHero } from "@/lib/content/store"
import { HeroForm } from "../hero-form"

export default async function AdminHeroPage() {
  const hero = await getHomeHero()
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Главная · большой блок</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Фото и подпись справа на первом экране сайта.
          </p>
        </div>
        <Link href="/admin/products" className="text-sm text-muted-foreground hover:text-foreground">
          ← К товарам
        </Link>
      </div>
      <div className="max-w-lg rounded-2xl border bg-card p-5">
        <HeroForm hero={hero} />
      </div>
    </div>
  )
}
