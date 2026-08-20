"use client"

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit & { once?: boolean }
) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  const once = options?.once ?? true

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      {
        root: options?.root ?? null,
        rootMargin: options?.rootMargin ?? "0px 0px -8% 0px",
        threshold: options?.threshold ?? 0.12,
      }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once, options?.root, options?.rootMargin, options?.threshold])

  return { ref, inView }
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  id,
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: ElementType
  id?: string
}) {
  const { ref, inView } = useInView<HTMLElement>()
  return (
    <Tag
      ref={ref}
      id={id}
      className={cn("motion-reveal", inView && "is-in", className)}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

export function StaggerItem({
  children,
  className,
  index = 0,
  step = 80,
}: {
  children: ReactNode
  className?: string
  index?: number
  step?: number
}) {
  return (
    <Reveal className={className} delay={index * step}>
      {children}
    </Reveal>
  )
}

export function Parallax({
  children,
  className,
  strength = 0.035,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [y, setY] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const mid = rect.top + rect.height / 2 - window.innerHeight / 2
        setY(-mid * strength)
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [strength])

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div
        className="will-change-transform"
        style={{ transform: `translate3d(0, ${y}px, 0)` }}
      >
        {children}
      </div>
    </div>
  )
}

export function PowerOn({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  return (
    <div ref={ref} className={cn("motion-power", inView && "is-on", className)}>
      {children}
    </div>
  )
}

export function CountUp({
  value,
  suffix = "",
  className,
  duration = 900,
}: {
  value: number
  suffix?: string
  className?: string
  duration?: number
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion()) {
      setN(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setN(Math.round(value * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, inView, value])

  return (
    <span ref={ref} className={className}>
      {n}
      {suffix}
    </span>
  )
}
