export function formatMoney(tjs: number) {
  const formatted = new Intl.NumberFormat("ru-TJ", {
    maximumFractionDigits: 0,
  }).format(Math.round(tjs))
  return `${formatted} TJS`
}

export function formatTjPhone(raw: string) {
  let digits = raw.replace(/\D/g, "")
  if (digits.startsWith("992")) digits = digits.slice(3)
  digits = digits.slice(0, 9)
  const a = digits.slice(0, 2)
  const b = digits.slice(2, 5)
  const c = digits.slice(5, 7)
  const d = digits.slice(7, 9)
  let out = "+992"
  if (a) out += ` ${a}`
  if (b) out += ` ${b}`
  if (c) out += ` ${c}`
  if (d) out += ` ${d}`
  return out
}

export function isValidTjPhone(phone: string) {
  return /^\+992 \d{2} \d{3} \d{2} \d{2}$/.test(phone)
}

export function formatPitch(pitch: number) {
  return `P${Number.isInteger(pitch) ? pitch : pitch.toFixed(1)}`
}
