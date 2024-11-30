import { PrismaAddressesRepository } from '@/repositories/prisma/prisma-addresses-repository'

import { CreateAddressUseCase } from '../create-address'

export function makeCreateAddressUseCase() {
  const addressesRepository = new PrismaAddressesRepository()
  const createAddressUseCase = new CreateAddressUseCase(addressesRepository)

  return createAddressUseCase
}
