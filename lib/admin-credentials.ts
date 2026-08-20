import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"

export type AdminCredentials = {
  login: string
  salt: string
  passwordHash: string
}

const LOCAL_FILE = path.join(process.cwd(), "data", "admin.json")
const BLOB_KEY = "cms/admin.json"

function useRemoteBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN && process.env.VERCEL)
}

export function defaultLogin() {
  return process.env.ADMIN_LOGIN || "admin"
}

export function defaultPassword() {
  return process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "fastled")
}

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  return toHex(await crypto.subtle.digest("SHA-256", data))
}

export function newSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function makeCredentials(login: string, password: string): Promise<AdminCredentials> {
  const salt = newSalt()
  return {
    login: login.trim(),
    salt,
    passwordHash: await hashPassword(password, salt),
  }
}

let mem: AdminCredentials | null | undefined
let inflight: Promise<AdminCredentials | null> | null = null

async function readBlobCredentials(): Promise<AdminCredentials | null> {
  if (!useRemoteBlob()) return null
  try {
    const { get } = await import("@vercel/blob")
    const result = await get(BLOB_KEY, {
      access: "private",
      useCache: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    if (result?.statusCode === 200 && result.stream) {
      const raw = JSON.parse(await new Response(result.stream).text()) as Partial<AdminCredentials>
      if (raw.login && raw.salt && raw.passwordHash) {
        return {
          login: String(raw.login),
          salt: String(raw.salt),
          passwordHash: String(raw.passwordHash),
        }
      }
    }
  } catch {
    /* empty */
  }
  return null
}

async function writeBlobCredentials(creds: AdminCredentials) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false
  try {
    const { put } = await import("@vercel/blob")
    await put(BLOB_KEY, JSON.stringify(creds, null, 2), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    return true
  } catch {
    return false
  }
}

async function loadCredentials(): Promise<AdminCredentials | null> {
  const fromBlob = await readBlobCredentials()
  if (fromBlob) return fromBlob
  if (useRemoteBlob()) return null
  try {
    const text = await readFile(LOCAL_FILE, "utf8")
    const raw = JSON.parse(text) as Partial<AdminCredentials>
    if (raw.login && raw.salt && raw.passwordHash) {
      return {
        login: String(raw.login),
        salt: String(raw.salt),
        passwordHash: String(raw.passwordHash),
      }
    }
  } catch {
    /* no file yet */
  }
  return null
}

export async function readCredentials(): Promise<AdminCredentials | null> {
  if (mem !== undefined) return mem
  if (!inflight) {
    inflight = loadCredentials()
      .then((data) => {
        mem = data
        return data
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export async function writeCredentials(creds: AdminCredentials) {
  mem = creds
  if (useRemoteBlob()) {
    const ok = await writeBlobCredentials(creds)
    if (!ok) throw new Error("Не удалось сохранить логин. Проверьте BLOB_READ_WRITE_TOKEN.")
    return
  }
  await mkdir(path.dirname(LOCAL_FILE), { recursive: true })
  await writeFile(LOCAL_FILE, JSON.stringify(creds, null, 2), "utf8")
}

export async function verifyCredentials(login: string, password: string) {
  const stored = await readCredentials()
  if (stored) {
    if (login.trim() !== stored.login) return false
    const hash = await hashPassword(password, stored.salt)
    return hash === stored.passwordHash
  }
  const expectedLogin = defaultLogin()
  const expectedPassword = defaultPassword()
  if (!expectedPassword) return false
  return login.trim() === expectedLogin && password === expectedPassword
}

export async function getAdminLoginLabel() {
  const stored = await readCredentials()
  return stored?.login || defaultLogin()
}
