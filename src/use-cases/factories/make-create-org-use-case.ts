import { PrismaAddressesRepository } from '@/repositories/prisma/prisma-addresses-repository'
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'

import { CreateOrgUseCase } from '../create-org'

export function makeCreateOrgUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const addressesRepository = new PrismaAddressesRepository()

  const createOrgUseCase = new CreateOrgUseCase(
    orgsRepository,
    addressesRepository,
  )

  return createOrgUseCase
}
