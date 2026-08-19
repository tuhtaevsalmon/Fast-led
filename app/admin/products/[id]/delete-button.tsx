"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter()
  return (
    <Button
      type="button"
      variant="outline"
      onClick={async () => {
        if (!confirm("Удалить эту модель?")) return
        await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
        router.push("/admin/products")
        router.refresh()
      }}
    >
      Удалить
    </Button>
  )
}
