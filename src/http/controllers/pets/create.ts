import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    ageRange: z.enum(['INFANT', 'JUVENILE', 'ADULT', 'SENIOR']),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
    environmentSize: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
    energyLevel: z.enum(['VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH']),
    independencyLevel: z.enum(['LOW', 'MODERATE', 'HIGH']),
  })

  const {
    name,
    about,
    ageRange,
    size,
    environmentSize,
    energyLevel,
    independencyLevel,
  } = createPetBodySchema.parse(request.body)

  const createPetUseCase = makeCreatePetUseCase()

  createPetUseCase.execute({
    orgId: request.user.sub,
    name,
    about,
    ageRange,
    size,
    environmentSize,
    energyLevel,
    independencyLevel,
  })

  return reply.status(201).send()
}
