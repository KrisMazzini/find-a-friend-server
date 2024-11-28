import { FastifyInstance } from 'fastify'

import { create } from './create'

export function orgRoutes(app: FastifyInstance) {
  app.post('/orgs', create)
}
