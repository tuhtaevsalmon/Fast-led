import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80 active:opacity-60",
        className
      )}
    >
      <Image
        src="/logo-mark.png"
        alt="Fast LED"
        width={48}
        height={48}
        className="size-10 shrink-0 object-contain sm:size-11"
        priority
      />
      <span className="text-[15px] font-semibold tracking-tight">Fast LED</span>
    </Link>
  )
}
