import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryAddressesRepository } from '@/repositories/in-memory/in-memory-addresses-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'

import { SearchPetsUseCase } from './search-pets'

let addressesRepository: InMemoryAddressesRepository
let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository

let sut: SearchPetsUseCase

describe('Use Case: Search Pets', async () => {
  beforeEach(async () => {
    addressesRepository = new InMemoryAddressesRepository()
    orgsRepository = new InMemoryOrgsRepository(addressesRepository)
    petsRepository = new InMemoryPetsRepository(orgsRepository)

    sut = new SearchPetsUseCase(petsRepository)

    await addressesRepository.createAddress({
      id: 'address-id',
      city_id: 'city-id',
      zip_code: '36000000',
      state_id: 'state-id',
      street: 'Avenida Rio Branco',
      district: 'Centro',
      number: '0',
    })

    await orgsRepository.create({
      id: 'org-id',
      address_id: 'address-id',
      email: 'petlovers@org.com',
      name: 'Pet Lovers',
      password_hash: '123456',
      whatsapp: '32988888888',
    })

    await petsRepository.create({
      name: 'Heine',
      org_id: 'org-id',
      about: 'A cute pet',
      age_range: 'INFANT',
      energy_level: 'HIGH',
      size: 'SMALL',
      environment_size: 'SMALL',
      independency_level: 'MODERATE',
    })

    await petsRepository.create({
      name: 'Titinho',
      org_id: 'org-id',
      about: 'A cute pet',
      age_range: 'JUVENILE',
      energy_level: 'MODERATE',
      size: 'MEDIUM',
      environment_size: 'MEDIUM',
      independency_level: 'HIGH',
    })
  })

  it('should be possible to search pets by city', async () => {
    await petsRepository.create({
      name: 'Rocco',
      org_id: 'other-org-id',
      about: 'A cute pet',
      age_range: 'INFANT',
      energy_level: 'HIGH',
      size: 'SMALL',
      environment_size: 'SMALL',
      independency_level: 'MODERATE',
    })

    const { pets } = await sut.execute({
      cityId: 'city-id',
      page: 1,
    })

    expect(pets).toEqual([
      expect.objectContaining({
        name: 'Heine',
      }),
      expect.objectContaining({
        name: 'Titinho',
      }),
    ])
  })

  it('should be possible to search pets by age range', async () => {
    const { pets } = await sut.execute({
      cityId: 'city-id',
      ageRange: 'INFANT',
      page: 1,
    })

    expect(pets).toEqual([
      expect.objectContaining({
        name: 'Heine',
      }),
    ])
  })

  it('should be possible to search pets by energy level', async () => {
    const { pets } = await sut.execute({
      cityId: 'city-id',
      energyLevel: 'HIGH',
      page: 1,
    })

    expect(pets).toEqual([
      expect.objectContaining({
        name: 'Heine',
      }),
    ])
  })

  it('should be possible to search pets by environment', async () => {
    const { pets } = await sut.execute({
      cityId: 'city-id',
      environmentSize: 'SMALL',
      page: 1,
    })

    expect(pets).toEqual([
      expect.objectContaining({
        name: 'Heine',
      }),
    ])
  })

  it('should be possible to search pets by independency level', async () => {
    const { pets } = await sut.execute({
      cityId: 'city-id',
      independencyLevel: 'MODERATE',
      page: 1,
    })

    expect(pets).toEqual([
      expect.objectContaining({
        name: 'Heine',
      }),
    ])
  })

  it('should be possible to search pets by size', async () => {
    const { pets } = await sut.execute({
      cityId: 'city-id',
      size: 'SMALL',
      page: 1,
    })

    expect(pets).toEqual([
      expect.objectContaining({
        name: 'Heine',
      }),
    ])
  })

  it('should be possible to search pets by multiple params', async () => {
    const { pets } = await sut.execute({
      cityId: 'city-id',
      size: 'SMALL',
      ageRange: 'INFANT',
      energyLevel: 'HIGH',
      environmentSize: 'SMALL',
      independencyLevel: 'MODERATE',
      page: 1,
    })

    expect(pets).toEqual([
      expect.objectContaining({
        name: 'Heine',
      }),
    ])
  })

  it('should be possible to search paginated pets', async () => {
    petsRepository.pets = []

    for (let i = 1; i <= 22; i++) {
      await petsRepository.create({
        name: `Pet ${i}`,
        org_id: 'org-id',
        about: 'A cute pet',
        age_range: 'INFANT',
        energy_level: 'HIGH',
        size: 'SMALL',
        environment_size: 'SMALL',
        independency_level: 'MODERATE',
      })
    }

    const { pets } = await sut.execute({
      cityId: 'city-id',
      page: 2,
    })

    expect(pets).toEqual([
      expect.objectContaining({
        name: 'Pet 21',
      }),
      expect.objectContaining({
        name: 'Pet 22',
      }),
    ])
  })
})
