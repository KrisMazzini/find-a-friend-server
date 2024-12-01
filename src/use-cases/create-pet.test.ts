import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'

import { CreatePetUseCase } from './create-pet'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: CreatePetUseCase

describe('Use Case: Create Pet', async () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()

    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should be possible to create a pet', async () => {
    orgsRepository.orgs.push({
      id: 'org-id',
      address_id: 'address-id',
      name: 'Pet Lovers',
      email: 'petlovers@org.com',
      whatsapp: '32999999999',
      password_hash: '123456',
      created_at: new Date(),
    })

    const { pet } = await sut.execute({
      orgId: 'org-id',
      name: 'Heine',
      about: 'A cute Yorkshire puppy',
      ageRange: 'INFANT',
      size: 'SMALL',
      environmentSize: 'SMALL',
      energyLevel: 'HIGH',
      independencyLevel: 'MODERATE',
    })

    expect(pet).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Heine',
        about: 'A cute Yorkshire puppy',
        age_range: 'INFANT',
        size: 'SMALL',
        environment_size: 'SMALL',
        energy_level: 'HIGH',
        independency_level: 'MODERATE',
        created_at: expect.any(Date),
      }),
    )
  })

  it('should not be possible to create a pet with an invalid org', async () => {
    await expect(() =>
      sut.execute({
        orgId: 'org-id',
        name: 'Heine',
        about: 'A cute Yorkshire puppy',
        ageRange: 'INFANT',
        size: 'SMALL',
        environmentSize: 'SMALL',
        energyLevel: 'HIGH',
        independencyLevel: 'MODERATE',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
