"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  return (
    <form
      className="mx-auto max-w-sm space-y-4 rounded-2xl border bg-card p-6"
      onSubmit={async (e) => {
        e.preventDefault()
        setError("")
        setBusy(true)
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login, password }),
        })
        setBusy(false)
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data.error || "Неверный логин или пароль")
          return
        }
        router.push("/admin/products")
        router.refresh()
      }}
    >
      <h1 className="text-xl font-semibold tracking-tight">Вход в админку</h1>
      <div className="space-y-1.5">
        <Label htmlFor="login">Логин</Label>
        <Input
          id="login"
          autoComplete="username"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Вход…" : "Войти"}
      </Button>
    </form>
  )
}
