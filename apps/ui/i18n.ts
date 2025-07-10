// Re-export the next-intl configuration for automatic discovery by Next.js
// This file must be at the root level (apps/ui/i18n.ts) for next-intl to find it automatically
// See: https://next-intl.dev/docs/getting-started/app-router
import { getRequestConfig } from 'next-intl/server'

import { routing } from './src/lib/navigation'

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    messages: (
      await (locale === 'en'
        ? // When using Turbopack, this will enable HMR for `en`
          import(`./locales/en.json`)
        : import(`./locales/${locale}.json`))
    ).default,
    timeZone: 'Europe/Prague',
  }
})
