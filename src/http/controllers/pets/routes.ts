import { FastifyInstance } from 'fastify'

import { verifyJwt } from '../middlewares/verify-jwt'
import { create } from './create'
import { get } from './get'
import { search } from './search'

export async function petRoutes(app: FastifyInstance) {
  app.post('/', { onRequest: verifyJwt() }, create)

  app.get('/:id', get)

  app.get('/search', search)
}
