"use client"

import { useState } from "react"
import { OrderForm } from "@/components/order-form"
import type { SiteSettings } from "@/lib/types"

export function ContactForm({
  compact = false,
  alignBottom = false,
  settings,
}: {
  compact?: boolean
  alignBottom?: boolean
  settings: SiteSettings
}) {
  const [sent, setSent] = useState(false)
  if (sent) {
    return (
      <p className="rounded-xl bg-primary/15 p-4 text-sm text-foreground">
        Заявка открыта в WhatsApp.
      </p>
    )
  }
  return (
    <div className={alignBottom ? "flex h-full min-h-0 flex-1 flex-col" : undefined}>
      <OrderForm
        compact={compact}
        alignBottom={alignBottom}
        settings={settings}
        onSubmit={() => setSent(true)}
        submitLabel="Отправить заявку"
      />
    </div>
  )
}
