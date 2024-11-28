import fastify from 'fastify'
import { ZodError } from 'zod'

import { orgRoutes } from './controllers/orgs/routes'
import { env } from './env'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export const app = fastify()

app.register(orgRoutes)

app.setErrorHandler(async (error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({
      message: error.message,
    })
  }

  if (env.NODE_ENV === 'production') {
    // TODO: Log to DataDog/NewRelic/Sentry
  } else {
    console.log(error)
  }

  return reply.status(500).send({
    message: 'Internal server error.',
  })
})
