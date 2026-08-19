"use client"

import { useState } from "react"
import { OrderForm } from "@/components/order-form"

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false)
  if (sent) {
    return (
      <p className="rounded-xl bg-primary/15 p-4 text-sm text-foreground">
        Заявка отправлена. Менеджер свяжется выбранным способом.
      </p>
    )
  }
  return (
    <OrderForm
      compact={compact}
      onSubmit={() => setSent(true)}
      submitLabel="Отправить заявку"
    />
  )
}
