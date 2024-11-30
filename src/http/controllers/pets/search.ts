import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeSearchPetsUseCase } from '@/use-cases/factories/make-search-pets-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchPetsQuerySchema = z.object({
    cityId: z.string().uuid(),
    page: z.coerce.number().min(1).default(1),
    ageRange: z.enum(['INFANT', 'JUVENILE', 'ADULT', 'SENIOR']).optional(),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    environmentSize: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    energyLevel: z
      .enum(['VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'])
      .optional(),
    independencyLevel: z.enum(['LOW', 'MODERATE', 'HIGH']).optional(),
  })

  const query = searchPetsQuerySchema.parse(request.query)

  const searchPetsUseCase = makeSearchPetsUseCase()

  const { pets } = await searchPetsUseCase.execute(query)

  return reply.status(200).send({ pets })
}
