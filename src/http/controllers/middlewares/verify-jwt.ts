import { VerifyOptions } from '@fastify/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyJwt(options?: Partial<VerifyOptions>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify(options)
    } catch {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
