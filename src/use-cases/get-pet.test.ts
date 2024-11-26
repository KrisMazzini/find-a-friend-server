import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InMemoryAddressesRepository } from '@/repositories/in-memory/in-memory-addresses-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'

import { GetPetUseCase } from './get-pet'

let addressesRepository: InMemoryAddressesRepository
let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository

let sut: GetPetUseCase

describe('Use Case: Get Pet', async () => {
  beforeEach(async () => {
    addressesRepository = new InMemoryAddressesRepository()
    orgsRepository = new InMemoryOrgsRepository(addressesRepository)
    petsRepository = new InMemoryPetsRepository(orgsRepository)

    sut = new GetPetUseCase(petsRepository)
  })

  it('should be possible to get pet details', async () => {
    await petsRepository.create({
      id: 'pet-id',
      name: 'Heine',
      org_id: 'org-id',
      about: 'A cute pet',
      age_range: 'INFANT',
      energy_level: 'HIGH',
      size: 'SMALL',
      environment_size: 'SMALL',
      independency_level: 'MODERATE',
    })

    const { pet } = await sut.execute({
      petId: 'pet-id',
    })

    expect(pet).toEqual(
      expect.objectContaining({
        name: 'Heine',
      }),
    )
  })

  it('should not be possible to get details of a inexistent pet', async () => {
    await expect(() =>
      sut.execute({
        petId: 'pet-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
