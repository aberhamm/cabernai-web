import '@/styles/globals.css'

import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { LayoutProps } from '@/types/next'

import { fontInter, fontRoboto } from '@/lib/fonts'
import { setupLibraries } from '@/lib/general-helpers'
import { routing } from '@/lib/navigation'
import { cn } from '@/lib/styles'
import { TailwindIndicator } from '@/components/elementary/TailwindIndicator'
import { Footer } from '@/components/page-builder/single-types/Footer'
import { Header } from '@/components/page-builder/single-types/Header'
import { ClientProviders } from '@/components/providers/ClientProviders'
import { ServerProviders } from '@/components/providers/ServerProviders'
import { Toaster } from '@/components/ui/toaster'

setupLibraries()

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({ children, params }: LayoutProps) {
  if (!routing.locales.includes(params.locale)) {
    notFound()
  }

  // Enable static rendering
  // https://next-intl-docs.vercel.app/docs/getting-started/app-router/with-i18n-routing#static-rendering
  setRequestLocale(params.locale)

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body
        className={cn(
          fontInter.variable,
          'font-sans antialiased',
          'bg-background'
        )}
      >
        <ServerProviders params={params}>
          <ClientProviders>
            <Header locale={params.locale} />
            {children}
            <Footer locale={params.locale} />
            <Toaster />
            <TailwindIndicator />
          </ClientProviders>
        </ServerProviders>
      </body>
    </html>
  )
}
