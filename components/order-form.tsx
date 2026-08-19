"use client"

import { useId, useState } from "react"
import { CITIES } from "@/lib/portfolio"
import { leadText, openWhatsApp, telHref } from "@/lib/content/urls"
import type { ContactChannel, SiteSettings } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function OrderForm({
  onSubmit,
  submitLabel = "Оформить заказ / Отправить заявку",
  compact = false,
  alignBottom = false,
  settings,
  extraText,
}: {
  onSubmit: (data: {
    name: string
    phone?: string
    city: string
    install: boolean
    channel: ContactChannel
  }) => void
  submitLabel?: string
  compact?: boolean
  alignBottom?: boolean
  settings: SiteSettings
  extraText?: (data: { name: string; city: string; install: boolean }) => string
}) {
  const formId = useId()
  const [name, setName] = useState("")
  const [city, setCity] = useState("Душанбе")
  const [install, setInstall] = useState(true)
  const [error, setError] = useState("")
  const fieldH = compact ? "h-10" : "h-11"
  const triggerClass = cn("w-full", fieldH, compact ? "data-[size=default]:h-10" : "data-[size=default]:h-11")

  return (
    <form
      className={cn(
        compact ? "space-y-2" : "space-y-3",
        alignBottom && "flex h-full min-h-0 flex-col lg:flex-1"
      )}
      onSubmit={(e) => {
        e.preventDefault()
        if (name.trim().length < 2) {
          setError("Укажите имя")
          return
        }
        setError("")
        const payload = { name: name.trim(), city, install }
        const extra = extraText?.(payload)?.trim()
        const text = extra ? `${leadText(payload)}\n\n${extra}` : leadText(payload)
        openWhatsApp(settings, text)
        onSubmit({ ...payload, channel: "whatsapp" })
      }}
    >
      <div className={compact ? "space-y-1" : "space-y-1.5"}>
        <Label htmlFor={`${formId}-name`} className={compact ? "text-xs" : undefined}>
          Имя клиента
        </Label>
        <Input
          id={`${formId}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Алишер"
          className={fieldH}
        />
      </div>
      <div className={compact ? "space-y-1" : "space-y-1.5"}>
        <Label className={compact ? "text-xs" : undefined}>Город</Label>
        <Select value={city} onValueChange={(v) => setCity(String(v ?? "Душанбе"))}>
          <SelectTrigger className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className={compact ? "space-y-1" : "space-y-1.5"}>
        <Label className={compact ? "text-xs" : undefined}>
          Нужен монтаж и металлоконструкция?
        </Label>
        <Select
          value={install ? "yes" : "no"}
          onValueChange={(v) => setInstall(v === "yes")}
        >
          <SelectTrigger className={triggerClass}>
            <SelectValue>
              {install ? "Да, под ключ" : "Нет, только экраны"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Да, под ключ</SelectItem>
            <SelectItem value="no">Нет, только экраны</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className={cn("space-y-2 pt-1", alignBottom && "lg:mt-auto")}>
        <Button
          type="submit"
          variant="outline"
          className={cn(
            "w-full border-primary/25 bg-primary/12 text-sm font-medium text-primary hover:bg-primary/18",
            compact ? "h-9" : "h-10"
          )}
        >
          {submitLabel}
        </Button>
        <Button
          type="button"
          className={cn("w-full", compact ? "h-11" : "h-12")}
          nativeButton={false}
          render={<a href={telHref(settings)} />}
        >
          Позвонить
        </Button>
      </div>
    </form>
  )
}
