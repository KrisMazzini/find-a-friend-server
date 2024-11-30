import { FastifyInstance } from 'fastify'

import { verifyJwt } from '../middlewares/verify-jwt'
import { create } from './create'

export async function petRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/', create)
}