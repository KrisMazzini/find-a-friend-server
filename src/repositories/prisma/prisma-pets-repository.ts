import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import { FindAllParams, PetsRepository } from '../pets-respository'

export class PrismaPetsRepository implements PetsRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }

  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async findAll({
    cityId,
    ageRange,
    energyLevel,
    environmentSize,
    independencyLevel,
    size,
    page,
  }: FindAllParams) {
    const pets = await prisma.pet.findMany({
      where: {
        age_range: ageRange,
        energy_level: energyLevel,
        environment_size: environmentSize,
        independency_level: independencyLevel,
        size,
        org: {
          address: {
            city_id: cityId,
          },
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return pets
  }
}
