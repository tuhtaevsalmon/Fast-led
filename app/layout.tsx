import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { getSettings } from "@/lib/content/store"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const OG_IMAGE = "/led/hero-stage.png"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Fast LED — светодиодные экраны в Душанбе и Таджикистане",
  description: SITE_DESCRIPTION,
  keywords: [
    "LED экраны Душанбе",
    "светодиодные экраны Таджикистан",
    "led экран купить Душанбе",
    "медиафасад Таджикистан",
    "видеостена LED",
    "Absen Таджикистан",
    "Unilumin Таджикистан",
    "монтаж led экранов",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Fast LED — светодиодные экраны в Душанбе",
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1024, height: 517, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fast LED — светодиодные экраны в Душанбе",
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.YANDEX_VERIFICATION || undefined,
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}${OG_IMAGE}`,
    telephone: settings.phoneTel || settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Душанбе",
      addressCountry: "TJ",
    },
    ...(settings.instagram
      ? { sameAs: [`https://instagram.com/${settings.instagram}`] }
      : {}),
  }

  return (
    <html
      lang="ru"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
