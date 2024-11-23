import { beforeEach, describe, expect, it } from 'vitest'

import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InMemoryAddressesRepository } from '@/repositories/in-memory/in-memory-addresses-repository'

import { CreateAddressUseCase } from './create-address'

let addressesRepository: InMemoryAddressesRepository
let sut: CreateAddressUseCase

describe('Use Case: Create Address', async () => {
  beforeEach(() => {
    addressesRepository = new InMemoryAddressesRepository()
    sut = new CreateAddressUseCase(addressesRepository)
  })

  it('should be possible to create an address', async () => {
    addressesRepository.states.push({
      id: 'state-id',
      name: 'Minas Gerais',
      uf: 'MG',
    })

    addressesRepository.cities.push({
      id: 'city-id',
      name: 'Juiz de Fora',
      state_id: 'state-id',
    })

    const { address } = await sut.execute({
      zipCode: '36000000',
      stateId: 'state-id',
      cityName: 'Juiz de Fora',
      street: 'Avenida Rio Branco',
      district: 'Centro',
      number: '0',
      complement: 'Algum complemento',
    })

    expect(address).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        zip_code: '36000000',
        state_id: 'state-id',
        city_id: 'city-id',
        street: 'Avenida Rio Branco',
        district: 'Centro',
        number: '0',
        complement: 'Algum complemento',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })

  it('should be possible to create an address when the city is not registered yet', async () => {
    addressesRepository.states.push({
      id: 'state-id',
      name: 'Minas Gerais',
      uf: 'MG',
    })

    const { address } = await sut.execute({
      zipCode: '36000000',
      stateId: 'state-id',
      cityName: 'Juiz de Fora',
      street: 'Avenida Rio Branco',
      district: 'Centro',
      number: '0',
      complement: 'Algum complemento',
    })

    expect(address).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        zip_code: '36000000',
        state_id: 'state-id',
        city_id: expect.any(String),
        street: 'Avenida Rio Branco',
        district: 'Centro',
        number: '0',
        complement: 'Algum complemento',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }),
    )
  })

  it('should not be possible to create an address to a non-existing state', async () => {
    await expect(() =>
      sut.execute({
        zipCode: '36000000',
        stateId: 'state-id',
        cityName: 'Juiz de Fora',
        street: 'Avenida Rio Branco',
        district: 'Centro',
        number: '0',
        complement: 'Algum complemento',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
