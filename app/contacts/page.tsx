import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactsPage() {
  return (
    <div className="page-shell py-8 sm:py-12 lg:py-16">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Контакты</h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
        Шоурум в центре Душанбе. Заявку можно отправить внизу страницы.
      </p>
      <div className="mt-10 space-y-4 text-sm text-muted-foreground">
        <p className="flex gap-3">
          <MapPin className="size-4" />
          пр. Рудаки 36, Душанбе
        </p>
        <p className="flex gap-3">
          <Phone className="size-4" />
          +992 900 00 00 00
        </p>
        <p className="flex gap-3">
          <Mail className="size-4" />
          hello@fastled.tj
        </p>
      </div>
      <div className="mt-10 max-w-3xl overflow-hidden rounded-2xl ring-1 ring-black/5">
        <iframe
          title="Шоурум Fast LED"
          className="h-52 w-full sm:h-72"
          loading="lazy"
          src="https://maps.google.com/maps?q=Rudaki%20Avenue%20Dushanbe&t=&z=15&ie=UTF8&iwloc=&output=embed"
        />
      </div>
    </div>
  )
}
