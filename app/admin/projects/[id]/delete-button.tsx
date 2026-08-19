"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter()
  return (
    <Button
      type="button"
      variant="outline"
      onClick={async () => {
        if (!confirm("Удалить этот проект?")) return
        await fetch(`/api/admin/projects/${id}`, { method: "DELETE" })
        router.push("/admin/projects")
        router.refresh()
      }}
    >
      Удалить
    </Button>
  )
}
