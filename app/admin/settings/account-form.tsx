"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AccountForm() {
  const [error, setError] = useState("")
  const [ok, setOk] = useState(false)
  const [busy, setBusy] = useState(false)

  return (
    <form
      className="max-w-lg space-y-4"
      onSubmit={async (e) => {
        e.preventDefault()
        setError("")
        setOk(false)
        setBusy(true)
        const form = new FormData(e.currentTarget)
        const res = await fetch("/api/admin/account", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newLogin: form.get("newLogin"),
            newPassword: form.get("newPassword"),
            confirmPassword: form.get("confirmPassword"),
          }),
        })
        const data = await res.json().catch(() => ({}))
        setBusy(false)
        if (!res.ok) {
          setError(data.error || "Ошибка")
          return
        }
        setOk(true)
        e.currentTarget.reset()
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="newLogin">Новый логин</Label>
        <Input id="newLogin" name="newLogin" required minLength={3} autoComplete="username" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="newPassword">Новый пароль</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Повтор нового пароля</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {ok ? <p className="text-sm text-primary">Логин и пароль обновлены</p> : null}
      <Button type="submit" disabled={busy}>
        {busy ? "Сохранение…" : "Сохранить"}
      </Button>
    </form>
  )
}
