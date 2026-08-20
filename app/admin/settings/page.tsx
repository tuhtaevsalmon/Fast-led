import { getAdminLoginLabel } from "@/lib/admin-credentials"
import { getSettings } from "@/lib/content/store"
import { AccountForm } from "./account-form"
import { SettingsForm } from "./settings-form"

export default async function AdminSettingsPage() {
  const [settings, login] = await Promise.all([getSettings(), getAdminLoginLabel()])
  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Контакты и соцсети</h1>
        <SettingsForm settings={settings} />
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold tracking-tight">Вход в админку</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Смена логина и пароля. После сохранения входите уже новыми данными.
        </p>
        <AccountForm login={login} />
      </div>
    </div>
  )
}
