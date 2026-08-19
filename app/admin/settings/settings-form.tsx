"use client"

import { useState } from "react"
import { formatTjPhone } from "@/lib/format"
import type { SiteSettings } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [error, setError] = useState("")
  const [ok, setOk] = useState(false)
  const [phone, setPhone] = useState(formatTjPhone(settings.phone))

  return (
    <form
      className="max-w-lg space-y-4"
      onSubmit={async (e) => {
        e.preventDefault()
        setError("")
        setOk(false)
        const form = new FormData(e.currentTarget)
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            settings: {
              phone,
              instagram: form.get("instagram"),
              address: form.get("address"),
              email: form.get("email"),
            },
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(data.error || "Ошибка")
          return
        }
        setOk(true)
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="phone">Телефон / WhatsApp</Label>
        <Input
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(formatTjPhone(e.target.value))}
          placeholder="+992 90 000 00 00"
        />
        <p className="text-xs text-muted-foreground">
          Один номер для звонка, WhatsApp, шапки, подвала и контактов.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="instagram">Instagram (fastled.tj или ссылка)</Label>
        <Input id="instagram" name="instagram" defaultValue={settings.instagram} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address">Адрес шоурума</Label>
        <Input id="address" name="address" defaultValue={settings.address} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" defaultValue={settings.email} />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {ok ? <p className="text-sm text-primary">Сохранено</p> : null}
      <Button type="submit">Сохранить</Button>
    </form>
  )
}
