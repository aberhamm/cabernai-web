export default ({ env }) => {
  const cloudinaryConfig = prepareCloudinaryConfig(env)
  if (!cloudinaryConfig) {
    console.info('Cloudinary configuration is not complete. Local file storage will be used.')
  }

  return {
    upload: {
      config: cloudinaryConfig ?? localUploadConfig(env),
    },

    seo: {
      enabled: true,
    },

    'config-sync': {
      enabled: true,
    },

    'users-permissions': {
      config: {
        jwt: {
          expiresIn: '30d', // this value is synced with NextAuth session maxAge
        },
      },
    },

    sentry: {
      enabled: true,
      config: {
        // Only set `dsn` property in production
        dsn: env('NODE_ENV') === 'production' ? env('SENTRY_DSN') : null,
        sendMetadata: true,
      },
    },

    // email: {
    //   config: {
    //     provider: "mailgun",
    //     providerOptions: {
    //       key: env("MAILGUN_API_KEY"),
    //       domain: env("MAILGUN_DOMAIN"),
    //       url: env("MAILGUN_HOST", "https://api.eu.mailgun.net"),
    //     },
    //     settings: {
    //       defaultFrom: env("MAILGUN_EMAIL"),
    //       defaultReplyTo: env("MAILGUN_EMAIL"),
    //     },
    //   },
    // },
  }
}

const localUploadConfig = (env): any => ({
  // Local provider setup
  // https://docs.strapi.io/dev-docs/plugins/upload
  sizeLimit: 250 * 1024 * 1024, // 256mb in bytes,
  mimeTypes: ['image/svg+xml', 'image/jpeg', 'image/png'],
})

const prepareCloudinaryConfig = (env) => {
  const cloudinaryName = env('CLOUDINARY_NAME')
  const cloudinaryApiKey = env('CLOUDINARY_API_KEY')
  const cloudinaryApiSecret = env('CLOUDINARY_API_SECRET')

  const cloudinaryRequirements = [cloudinaryName, cloudinaryApiKey, cloudinaryApiSecret]

  const cloudinaryRequirementsOk = cloudinaryRequirements.every((req) => req != null && req !== '')

  if (cloudinaryRequirementsOk) {
    return {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: cloudinaryName,
        api_key: cloudinaryApiKey,
        api_secret: cloudinaryApiSecret,
        secure: env('CLOUDINARY_SECURE', true),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    }
  }

  return undefined
}
