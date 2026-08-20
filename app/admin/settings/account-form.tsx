"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AccountForm({ login: initialLogin }: { login: string }) {
  const [login, setLogin] = useState(initialLogin)
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
            currentLogin: form.get("currentLogin"),
            currentPassword: form.get("currentPassword"),
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
        if (data.login) setLogin(String(data.login))
        setOk(true)
        e.currentTarget.reset()
      }}
    >
      <p className="text-sm text-muted-foreground">
        Текущий логин: <span className="font-medium text-foreground">{login}</span>
      </p>
      <div className="space-y-1.5">
        <Label htmlFor="currentLogin">Текущий логин</Label>
        <Input id="currentLogin" name="currentLogin" defaultValue={login} required autoComplete="username" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Текущий пароль</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="newLogin">Новый логин</Label>
        <Input id="newLogin" name="newLogin" defaultValue={login} required minLength={3} />
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
        {busy ? "Сохранение…" : "Сменить логин и пароль"}
      </Button>
    </form>
  )
}
