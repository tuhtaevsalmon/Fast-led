import Image from "next/image"
import { cn } from "@/lib/utils"

export function LedPreview({
  src,
  alt = "",
  className,
  label,
  caption,
  captionHint,
  captionAlways = false,
  priority = false,
  fit = "cover",
  quality = 90,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw",
  unoptimized = false,
}: {
  src: string
  alt?: string
  className?: string
  label?: string
  caption?: string
  captionHint?: string
  captionAlways?: boolean
  priority?: boolean
  fit?: "cover" | "contain"
  quality?: number
  sizes?: string
  unoptimized?: boolean
}) {
  if (!src) {
    return (
      <div className={cn("media-frame bg-muted", className)} aria-hidden />
    )
  }
  return (
    <div className={cn("media-frame relative overflow-hidden", className)}>
      <div
        className={cn(
          "absolute inset-0",
          fit === "contain" && "bg-white p-4 sm:p-6"
        )}
      >
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            quality={quality}
            sizes={sizes}
            unoptimized={unoptimized || src.startsWith("http")}
            className={cn(
              fit === "contain" ? "object-contain" : "object-cover",
              fit === "cover" &&
                "transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            )}
          />
        </div>
      </div>
      {caption ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
      ) : null}
      {caption ? (
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <p className="text-sm font-medium text-white">{caption}</p>
          {captionHint ? (
            <p
              className={cn(
                "mt-1 text-xs text-white/80",
                !captionAlways &&
                  "sm:max-h-0 sm:overflow-hidden sm:opacity-0 sm:transition-all sm:duration-300 sm:group-hover:max-h-10 sm:group-hover:opacity-100"
              )}
            >
              {captionHint}
            </p>
          ) : null}
        </div>
      ) : null}
      {label && !caption ? (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-4",
            fit === "cover" && "bg-gradient-to-t from-black/50 to-transparent"
          )}
        >
          <p
            className={cn(
              "text-xs",
              fit === "contain" ? "text-muted-foreground" : "text-white/90"
            )}
          >
            {label}
          </p>
        </div>
      ) : null}
    </div>
  )
}
