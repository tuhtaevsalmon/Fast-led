import Link from "next/link"
import { getPublicProjects } from "@/lib/content/store"
import { Button } from "@/components/ui/button"

export default async function AdminProjectsPage() {
  const projects = await getPublicProjects()
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Проекты</h1>
        {projects.length < 3 ? (
          <Button nativeButton={false} render={<Link href="/admin/projects/new" />}>
            Добавить
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground">Максимум 3 проекта</p>
        )}
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/admin/projects/${p.id}`}
            className="flex items-center justify-between gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-muted/50"
          >
            <div>
              <p className="text-sm font-medium">{p.title}</p>
              <p className="text-xs text-muted-foreground">
                {p.city} · {p.area} м²
              </p>
            </div>
            <span className="text-xs text-primary">Изменить</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
