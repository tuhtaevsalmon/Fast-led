"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FilePickButton } from "@/components/admin/file-pick-button"

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter()
  const isNew = !project
  const [error, setError] = useState("")
  const [image, setImage] = useState(project?.image ?? "")

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const payload = {
          title: form.get("title"),
          city: form.get("city"),
          area: form.get("area"),
          pitch: form.get("pitch"),
          place: form.get("place"),
          image,
        }
        const res = await fetch(isNew ? "/api/admin/projects" : `/api/admin/projects/${project.id}`, {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(data.error || "Ошибка")
          return
        }
        router.push("/admin/projects")
        router.refresh()
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Заголовок</Label>
          <Input id="title" name="title" defaultValue={project?.title} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">Город</Label>
          <Input id="city" name="city" defaultValue={project?.city} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="area">Площадь, м²</Label>
          <Input id="area" name="area" type="number" defaultValue={project?.area} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pitch">Шаг пикселя (необязательно)</Label>
          <Input id="pitch" name="pitch" type="number" step="0.1" defaultValue={project?.pitch} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="place">Короткое описание</Label>
        <Textarea id="place" name="place" rows={3} defaultValue={project?.place} />
      </div>
      <div className="space-y-2">
        <Label>Фото</Label>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-40 rounded-xl border object-cover" />
        ) : (
          <p className="text-sm text-muted-foreground">Нет фото</p>
        )}
        <FilePickButton
          disabled={isNew}
          onFile={async (file) => {
            if (isNew || !project) {
              setError("Сначала сохраните проект, потом фото")
              return
            }
            const form = new FormData()
            form.set("file", file)
            const res = await fetch(`/api/admin/projects/${project.id}/image`, {
              method: "POST",
              body: form,
            })
            const data = await res.json()
            if (res.ok) setImage(data.image)
            else setError(data.error || "Ошибка загрузки")
          }}
        />
        {image && !isNew && project ? (
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              await fetch(`/api/admin/projects/${project.id}/image`, { method: "DELETE" })
              setImage("")
            }}
          >
            Удалить фото
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit">Сохранить</Button>
    </form>
  )
}
