"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FilePickButton({
  accept = "image/*",
  disabled,
  onFile,
  className,
  label = "Выбрать файл",
}: {
  accept?: string
  disabled?: boolean
  onFile: (file: File) => void
  className?: string
  label?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ""
        }}
      />
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        {label}
      </Button>
    </div>
  )
}
