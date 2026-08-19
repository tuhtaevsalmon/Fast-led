import { getSettings } from "@/lib/content/store"
import { SettingsForm } from "./settings-form"

export default async function AdminSettingsPage() {
  const settings = await getSettings()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Контакты и соцсети</h1>
      <SettingsForm settings={settings} />
    </div>
  )
}
