import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetPetUseCase } from '@/use-cases/factories/make-get-pet-use-case'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getPetParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getPetParamsSchema.parse(request.params)

    const getPetUseCase = makeGetPetUseCase()

    const { pet } = await getPetUseCase.execute({ petId: id })

    return reply.status(200).send({ pet })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      })
    }

    throw error
  }
}
