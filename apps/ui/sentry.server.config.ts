// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { env } from '@/env.mjs'
import * as Sentry from '@sentry/nextjs'

// Only initialize Sentry if DSN is available
if (env.NEXT_PUBLIC_SENTRY_DSN) {
  try {
    Sentry.init({
      dsn: env.NEXT_PUBLIC_SENTRY_DSN,

      // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
      tracesSampleRate: 0.3,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,
    })
  } catch (error) {
    // Log initialization error but don't crash the app
    console.error('Sentry initialization failed:', error)
  }
} else {
  console.log('Sentry disabled - missing NEXT_PUBLIC_SENTRY_DSN')
}
