import { FastifyInstance } from 'fastify'

import { verifyJwt } from '../middlewares/verify-jwt'
import { authenticate } from './authenticate'
import { create } from './create'
import { refresh } from './refresh'

export function orgRoutes(app: FastifyInstance) {
  app.post('/orgs', create)

  app.post('/sessions', authenticate)

  app.patch(
    '/tokens/refresh',
    {
      onRequest: verifyJwt({ onlyCookie: true }),
    },
    refresh,
  )
}
