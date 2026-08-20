"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { CATEGORY_LABEL } from "@/lib/products"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FilePickButton } from "@/components/admin/file-pick-button"
import { parseResponse, errorMessage } from "@/lib/admin-fetch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const isNew = !product
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [image, setImage] = useState(product?.image ?? "")
  const [category, setCategory] = useState(product?.category ?? "indoor")
  const [ipRating, setIpRating] = useState(product?.ipRating ?? "IP31")
  const [unit, setUnit] = useState(product?.unit ?? "m2")
  const [inStock, setInStock] = useState(product?.inStock ?? true)
  const [hit, setHit] = useState(product?.hit ?? false)
  const [hidden, setHidden] = useState(product?.hidden ?? false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError("")
    const form = new FormData(e.currentTarget)
    const payload = {
      name: form.get("name"),
      slug: form.get("slug"),
      category,
      pitch: form.get("pitch"),
      brightness: form.get("brightness"),
      ipRating,
      cabinetW: form.get("cabinetW"),
      cabinetH: form.get("cabinetH"),
      resW: form.get("resW"),
      resH: form.get("resH"),
      powerPerM2: form.get("powerPerM2"),
      pricePerM2Tjs: form.get("pricePerM2Tjs"),
      unit,
      inStock,
      hit,
      hidden,
      description: form.get("description"),
      image,
    }
    const res = await fetch(isNew ? "/api/admin/products" : `/api/admin/products/${product.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const { ok, data } = await parseResponse(res)
    setBusy(false)
    if (!ok) {
      setError(errorMessage(res, data, "Не удалось сохранить"))
      return
    }
    router.push("/admin/products")
    router.refresh()
  }

  async function upload(file: File) {
    if (isNew) {
      setError("Сначала сохраните товар, потом фото")
      return
    }
    const form = new FormData()
    form.set("file", file)
    setError("")
    let res: Response
    try {
      res = await fetch(`/api/admin/products/${product.id}/image`, { method: "POST", body: form })
    } catch {
      setError("Нет соединения с сервером")
      return
    }
    const { ok, data } = await parseResponse(res)
    if (!ok) {
      setError(errorMessage(res, data))
      return
    }
    setImage(typeof data.image === "string" ? data.image : "")
    router.refresh()
  }

  async function removeImage() {
    if (isNew || !product) return
    setError("")
    try {
      const res = await fetch(`/api/admin/products/${product.id}/image`, { method: "DELETE" })
      const { ok, data } = await parseResponse(res)
      if (!ok) {
        setError(errorMessage(res, data))
        return
      }
    } catch {
      setError("Нет соединения с сервером")
      return
    }
    setImage("")
    router.refresh()
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название" name="name" defaultValue={product?.name} required />
        <Field label="Slug (URL)" name="slug" defaultValue={product?.slug} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Категория</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as Product["category"])}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Единица цены</Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as Product["unit"])}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="m2">м²</SelectItem>
              <SelectItem value="cabinet">кабинет</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Шаг пикселя" name="pitch" type="number" step="0.1" defaultValue={product?.pitch} />
        <Field label="Яркость, нит" name="brightness" type="number" defaultValue={product?.brightness} />
        <div className="space-y-1.5">
          <Label>IP</Label>
          <Select value={ipRating} onValueChange={(v) => setIpRating(v as Product["ipRating"])}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["IP31", "IP54", "IP65", "IP67"].map((ip) => (
                <SelectItem key={ip} value={ip}>
                  {ip}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Кабинет Ш, мм" name="cabinetW" type="number" defaultValue={product?.cabinetMm[0]} />
        <Field label="Кабинет В, мм" name="cabinetH" type="number" defaultValue={product?.cabinetMm[1]} />
        <Field label="Разрешение Ш" name="resW" type="number" defaultValue={product?.cabinetResolution[0]} />
        <Field label="Разрешение В" name="resH" type="number" defaultValue={product?.cabinetResolution[1]} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Вт / м²" name="powerPerM2" type="number" defaultValue={product?.powerPerM2} />
        <Field label="Цена TJS" name="pricePerM2Tjs" type="number" defaultValue={product?.pricePerM2Tjs} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Описание</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={product?.description} />
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          В наличии
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={hit} onChange={(e) => setHit(e.target.checked)} />
          Хит (карусель)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
          Скрыть с сайта
        </label>
      </div>
      <div className="space-y-2">
        <Label>Фото</Label>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-40 rounded-xl border object-contain bg-white" />
        ) : (
          <p className="text-sm text-muted-foreground">Нет фото</p>
        )}
        <div className="flex flex-wrap gap-2">
          <FilePickButton
            disabled={isNew || busy}
            onFile={(file) => void upload(file)}
          />
          {image ? (
            <Button type="button" variant="outline" onClick={() => void removeImage()}>
              Удалить фото
            </Button>
          ) : null}
        </div>
        {isNew ? (
          <p className="text-xs text-muted-foreground">Сохраните модель, затем загрузите фото.</p>
        ) : null}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
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

function Field({
  label,
  name,
  type = "text",
  step,
  defaultValue,
  required,
}: {
  label: string
  name: string
  type?: string
  step?: string
  defaultValue?: string | number
  required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        required={required}
      />
    </div>
  )
}
