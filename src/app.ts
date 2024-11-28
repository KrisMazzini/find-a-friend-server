import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { petRoutes } from './http/controllers/middlewares/pets/routes'
import { orgRoutes } from './http/controllers/orgs/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(orgRoutes)
app.register(petRoutes, { prefix: '/pets' })

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
