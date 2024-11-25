import { randomUUID } from 'node:crypto'

import { Pet, Prisma } from '@prisma/client'

import { OrgsRepository } from '../orgs-repository'
import { FindAllParams, PetsRepository } from '../pets-respository'

export class InMemoryPetsRepository implements PetsRepository {
  public pets: Pet[] = []

  constructor(private orgsRepository: OrgsRepository) {}

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: randomUUID(),
      org_id: data.org_id,
      name: data.name,
      about: data.about,
      age_range: data.age_range,
      size: data.size,
      environment_size: data.environment_size,
      energy_level: data.energy_level,
      independency_level: data.independency_level,
      created_at: new Date(),
    }

    this.pets.push(pet)

    return pet
  }

  async findAll({ cityId, page }: FindAllParams) {
    const orgsByCity = await this.orgsRepository.findManyByCityId(cityId)

    const orgIds = new Set(orgsByCity.map((org) => org.id))

    const pets = this.pets
      .filter((pet) => orgIds.has(pet.org_id))
      .slice((page - 1) * 20, page * 20)

    return pets
  }
}
