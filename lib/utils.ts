import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sliderNumber(value: number | readonly number[]) {
  return Array.isArray(value) ? Number(value[0]) : Number(value)
}

export function sliderRange(value: number | readonly number[]): [number, number] {
  if (Array.isArray(value) && value.length >= 2) {
    return [Number(value[0]), Number(value[1])]
  }
  const n = sliderNumber(value)
  return [n, n]
}
