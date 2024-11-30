import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { OrgAlreadyExistsError } from '@/errors/org-already-exists-error'
import { makeCreateOrgUseCase } from '@/use-cases/factories/make-create-org-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const createOrgBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().trim().min(6),
      whatsapp: z.string(),
      address: z.object({
        zipCode: z.string(),
        stateId: z.string(),
        cityName: z.string(),
        street: z.string(),
        district: z.string(),
        number: z.string(),
        complement: z.string().nullable(),
      }),
    })

    const { name, email, password, whatsapp, address } =
      createOrgBodySchema.parse(request.body)

    const createOrgUseCase = makeCreateOrgUseCase()

    await createOrgUseCase.execute({ name, email, password, whatsapp, address })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    throw error
  }
}
