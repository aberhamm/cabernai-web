module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    await next()

    if (ctx.body && ctx.body.data) {
      const prependBaseUrl = (data) => {
        if (Array.isArray(data)) {
          return data.map(prependBaseUrl)
        }

        if (data && data.attributes && data.attributes.url) {
          const baseUrl = strapi.config.server.url || "http://localhost:1337"
          data.attributes.url = `${baseUrl}${data.attributes.url}`
        }

        return data
      }

      ctx.body.data = prependBaseUrl(ctx.body.data)
    }
  }
}
