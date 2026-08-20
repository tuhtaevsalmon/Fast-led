import { MapPin, Phone } from "lucide-react"
import { mapEmbedUrl } from "@/lib/content/urls"
import { getSettings } from "@/lib/content/store"

export const dynamic = "force-dynamic"

export default async function ContactsPage() {
  const settings = await getSettings()
  return (
    <div className="page-shell py-8 sm:py-12 lg:py-16">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Контакты</h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
        Шоурум в центре Душанбе. Заявку можно отправить внизу страницы.
      </p>
      <div className="mt-10 space-y-4 text-sm text-muted-foreground">
        <p className="flex gap-3">
          <MapPin className="size-4" />
          {settings.address}
        </p>
        <p className="flex gap-3">
          <Phone className="size-4" />
          {settings.phone}
        </p>
      </div>
      <div className="mt-10 max-w-3xl overflow-hidden rounded-2xl ring-1 ring-black/5">
        <iframe
          title={settings.address}
          className="h-52 w-full sm:h-72"
          loading="lazy"
          src={mapEmbedUrl(settings, 15)}
        />
      </div>
    </div>
  )
}
