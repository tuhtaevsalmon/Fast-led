"use client"

import { useId, useState } from "react"
import { CITIES } from "@/lib/portfolio"
import { formatTjPhone, isValidTjPhone } from "@/lib/format"
import type { ContactChannel } from "@/lib/types"
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

export function OrderForm({
  onSubmit,
  submitLabel = "Оформить заказ / Отправить заявку",
  compact = false,
}: {
  onSubmit: (data: {
    name: string
    phone: string
    city: string
    install: boolean
    channel: ContactChannel
  }) => void
  submitLabel?: string
  compact?: boolean
}) {
  const formId = useId()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("+992 ")
  const [city, setCity] = useState("Душанбе")
  const [install, setInstall] = useState(true)
  const [channel, setChannel] = useState<ContactChannel>("whatsapp")
  const [error, setError] = useState("")

  return (
    <form
      className={compact ? "space-y-2" : "space-y-3"}
      onSubmit={(e) => {
        e.preventDefault()
        if (name.trim().length < 2) {
          setError("Укажите имя")
          return
        }
        if (!isValidTjPhone(phone)) {
          setError("Телефон в формате +992 XX XXX XX XX")
          return
        }
        setError("")
        onSubmit({ name: name.trim(), phone, city, install, channel })
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
          className={compact ? "h-8" : "h-10"}
        />
      </div>
      <div className={compact ? "space-y-1" : "space-y-1.5"}>
        <Label htmlFor={`${formId}-phone`} className={compact ? "text-xs" : undefined}>
          Телефон
        </Label>
        <Input
          id={`${formId}-phone`}
          value={phone}
          onChange={(e) => setPhone(formatTjPhone(e.target.value))}
          placeholder="+992 90 000 00 00"
          className={compact ? "h-8" : "h-10"}
        />
      </div>
      <div className={compact ? "space-y-1" : "space-y-1.5"}>
        <Label className={compact ? "text-xs" : undefined}>Город</Label>
        <Select value={city} onValueChange={(v) => setCity(String(v ?? "Душанбе"))}>
          <SelectTrigger className={compact ? "h-8 w-full" : "h-10 w-full"}>
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
          <SelectTrigger className={compact ? "h-8 w-full" : "h-10 w-full"}>
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
      <div className={compact ? "space-y-1" : "space-y-1.5"}>
        <Label className={compact ? "text-xs" : undefined}>Способ связи</Label>
        <Select
          value={channel}
          onValueChange={(v) => setChannel((v as ContactChannel) ?? "whatsapp")}
        >
          <SelectTrigger className={compact ? "h-8 w-full" : "h-10 w-full"}>
            <SelectValue>
              {channel === "call"
                ? "Звонок"
                : channel === "telegram"
                  ? "Telegram"
                  : "WhatsApp"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="call">Звонок</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="telegram">Telegram</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className={compact ? "h-9 w-full" : "h-11 w-full"}>
        {submitLabel}
      </Button>
    </form>
  )
}
