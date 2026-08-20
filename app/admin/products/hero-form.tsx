"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import type { HomeHero } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FilePickButton } from "@/components/admin/file-pick-button"

export function HeroForm({ hero }: { hero: HomeHero }) {
  const router = useRouter()
  const [title, setTitle] = useState(hero.title)
  const [caption, setCaption] = useState(hero.caption)
  const [image, setImage] = useState(hero.image)
  const [imageDark, setImageDark] = useState(hero.imageDark ?? "")
  const [error, setError] = useState("")
  const [ok, setOk] = useState(false)
  const [busy, setBusy] = useState(false)

  async function save(next = { image, imageDark }) {
    setBusy(true)
    setError("")
    setOk(false)
    const res = await fetch("/api/admin/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, caption, ...next }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) {
      setError(data.error || "Ошибка")
      return
    }
    if (data.image) setImage(String(data.image))
    setImageDark(String(data.imageDark ?? ""))
    setOk(true)
    router.push("/admin/products")
    router.refresh()
  }

  async function upload(file: File, slot: "light" | "dark") {
    setBusy(true)
    setError("")
    const form = new FormData()
    form.set("title", title)
    form.set("caption", caption)
    form.set("slot", slot)
    form.set("file", file)
    const res = await fetch("/api/admin/hero", { method: "PUT", body: form })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) {
      setError(data.error || "Ошибка загрузки")
      return
    }
    if (data.image) setImage(String(data.image))
    setImageDark(String(data.imageDark ?? ""))
    setOk(true)
    router.refresh()
  }

  async function clearDark() {
    await save({ image, imageDark: "" })
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        void save()
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="hero-title">Название</Label>
        <Input
          id="hero-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Unilumin Upad IV P2.6"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="hero-caption">Подпись под названием</Label>
        <Input
          id="hero-caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Шаг 2,6 мм · 4500 нит · IP65"
        />
      </div>
      <div className="space-y-2">
        <Label>Фото</Label>
        <p className="text-xs text-muted-foreground">
          Можно одно — оно будет и в светлой, и в тёмной теме. Если загрузить оба,
          картинка меняется вместе с темой.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 rounded-xl border p-3">
            <p className="text-sm font-medium">Светлая тема</p>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                className="h-36 w-full rounded-lg border bg-white object-cover"
              />
            ) : (
              <p className="text-sm text-muted-foreground">Нет фото</p>
            )}
            <FilePickButton
              disabled={busy}
              onFile={(file) => void upload(file, "light")}
            />
          </div>
          <div className="space-y-2 rounded-xl border p-3">
            <p className="text-sm font-medium">Тёмная тема</p>
            {imageDark ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageDark}
                alt=""
                className="h-36 w-full rounded-lg border bg-zinc-900 object-cover"
              />
            ) : (
              <p className="text-sm text-muted-foreground">Не задано — как светлая</p>
            )}
            <div className="flex flex-wrap gap-2">
              <FilePickButton
                disabled={busy}
                onFile={(file) => void upload(file, "dark")}
              />
              {imageDark ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void clearDark()}
                >
                  Убрать
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {ok ? <p className="text-sm text-primary">Сохранено</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? "Сохранение…" : "Сохранить"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => router.push("/admin/products")}
        >
          Отменить
        </Button>
      </div>
    </form>
  )
}
