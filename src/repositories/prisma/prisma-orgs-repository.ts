import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { OrgsRepository } from '../orgs-repository'

export class PrismaOrgsRepository implements OrgsRepository {
  async create(data: Prisma.OrgUncheckedCreateInput) {
    const org = await prisma.org.create({
      data,
    })

    return org
  }

  async findById(id: string) {
    const org = await prisma.org.findUnique({
      where: {
        id,
      },
    })

    return org
  }

  async findByEmail(email: string) {
    const org = await prisma.org.findUnique({
      where: {
        email,
      },
    })

    return org
  }

  async findManyByCityId(cityId: string) {
    const orgs = await prisma.org.findMany({
      where: {
        address: {
          city_id: cityId,
        },
      },
    })

    return orgs
  }
}
