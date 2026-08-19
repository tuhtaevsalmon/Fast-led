import { PROJECTS } from "@/lib/portfolio"
import { LedPreview } from "@/components/led-preview"

export default function PortfolioPage() {
  return (
    <div className="page-shell py-8 sm:py-12 lg:py-16">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Проекты</h1>
      <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
        Референсы объектов, которые собирают на тех же кабинетах: Dubai Mall, Times Square, ISE, Coachella.
      </p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {PROJECTS.map((p, i) => (
          <article
            key={p.id}
            className={`group ${i === 0 || i === 5 ? "sm:col-span-2 lg:col-span-4" : "lg:col-span-2"}`}
          >
            <LedPreview
              src={p.image}
              alt={p.title}
              className={i === 0 || i === 5 ? "aspect-[16/9]" : "aspect-[4/3]"}
              label={p.place}
            />
            <h2 className="mt-4 text-base tracking-tight">{p.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {p.city} · {p.area} м² · P{p.pitch}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
