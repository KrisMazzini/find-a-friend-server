import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { AddressesRepository } from '../addresses-repository'

export class PrismaAddressesRepository implements AddressesRepository {
  async createCity(name: string, stateId: string) {
    const city = await prisma.city.create({
      data: {
        name,
        state_id: stateId,
      },
    })

    return city
  }

  async createAddress(data: Prisma.AddressUncheckedCreateInput) {
    const address = await prisma.address.create({
      data,
    })

    return address
  }

  async findStateById(id: string) {
    const state = await prisma.state.findUnique({
      where: {
        id,
      },
    })

    return state
  }

  async findCityByNameAndStateId(name: string, stateId: string) {
    const city = await prisma.city.findFirst({
      where: {
        name,
        state_id: stateId,
      },
    })

    return city
  }
}
