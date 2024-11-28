import { FastifyInstance } from 'fastify'

import { authenticate } from './authenticate'
import { create } from './create'

export function orgRoutes(app: FastifyInstance) {
  app.post('/orgs', create)

  app.post('/sessions', authenticate)
}
