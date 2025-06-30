import cronTasks from './cron-tasks'

export default ({ env }) => ({
  url: env('PUBLIC_URL', 'http://0.0.0.0:1337'),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  cron: {
    enabled: env.bool('CRON_ENABLED', false),
    tasks: cronTasks,
  },
})
