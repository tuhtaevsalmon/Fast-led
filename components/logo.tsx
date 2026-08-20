"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = mounted && resolvedTheme === "dark"

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center transition-opacity duration-200 hover:opacity-80 active:opacity-60",
        className
      )}
      aria-label="Fast LED"
    >
      <span className="relative block h-9 w-[5.3rem] sm:h-10 sm:w-[5.9rem] lg:h-11 lg:w-[6.5rem]">
        <Image
          src="/logo-light.png"
          alt="Fast LED"
          fill
          sizes="104px"
          priority
          className={cn("object-contain object-left", dark && "hidden")}
        />
        <Image
          src="/logo-dark.png"
          alt=""
          fill
          sizes="104px"
          priority
          className={cn("object-contain object-left", !dark && "hidden")}
        />
      </span>
    </Link>
  )
}
