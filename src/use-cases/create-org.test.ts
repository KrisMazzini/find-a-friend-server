import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { OrgAlreadyExistsError } from '@/use-cases/errors/org-already-exists-error'
import { InMemoryAddressesRepository } from '@/repositories/in-memory/in-memory-addresses-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

import { CreateOrgUseCase } from './create-org'

let orgsRepository: InMemoryOrgsRepository
let addressesRepository: InMemoryAddressesRepository
let sut: CreateOrgUseCase

describe('Use Case: Create Org', async () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    addressesRepository = new InMemoryAddressesRepository()

    sut = new CreateOrgUseCase(orgsRepository, addressesRepository)
  })

  it('should be possible to create an org', async () => {
    addressesRepository.states.push({
      id: 'state-id',
      name: 'Minas Gerais',
      uf: 'MG',
    })

    const { org } = await sut.execute({
      name: 'Pet Lovers',
      email: 'petlovers@org.com',
      password: '123456',
      whatsapp: '32999999999',
      address: {
        zipCode: '36000000',
        stateId: 'state-id',
        cityName: 'Juiz de Fora',
        street: 'Avenida Rio Branco',
        district: 'Centro',
        number: '0',
        complement: 'Algum complemento',
      },
    })

    expect(org).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Pet Lovers',
        email: 'petlovers@org.com',
        whatsapp: '32999999999',
        password_hash: expect.any(String),
        created_at: expect.any(Date),
        address_id: expect.any(String),
      }),
    )
  })

  it('should hash org admin password upon creation', async () => {
    addressesRepository.states.push({
      id: 'state-id',
      name: 'Minas Gerais',
      uf: 'MG',
    })

    const password = '123456'

    const { org } = await sut.execute({
      name: 'Pet Lovers',
      email: 'petlovers@org.com',
      password,
      whatsapp: '32999999999',
      address: {
        zipCode: '36000000',
        stateId: 'state-id',
        cityName: 'Juiz de Fora',
        street: 'Avenida Rio Branco',
        district: 'Centro',
        number: '0',
        complement: 'Algum complemento',
      },
    })

    const isPasswordCorrectlyHash = await compare(password, org.password_hash)

    expect(isPasswordCorrectlyHash).toBe(true)
  })

  it('should not possible to create an org with the same email twice', async () => {
    addressesRepository.states.push({
      id: 'state-id',
      name: 'Minas Gerais',
      uf: 'MG',
    })

    const email = 'petlovers@org.com'

    await sut.execute({
      name: 'Pet Lovers',
      email,
      password: '123456',
      whatsapp: '32999999999',
      address: {
        zipCode: '36000000',
        stateId: 'state-id',
        cityName: 'Juiz de Fora',
        street: 'Avenida Rio Branco',
        district: 'Centro',
        number: '0',
        complement: 'Algum complemento',
      },
    })

    await expect(() =>
      sut.execute({
        name: 'Pet Lovers',
        email,
        password: '123456',
        whatsapp: '32999999999',
        address: {
          zipCode: '36000000',
          stateId: 'state-id',
          cityName: 'Juiz de Fora',
          street: 'Avenida Rio Branco',
          district: 'Centro',
          number: '0',
          complement: 'Algum complemento',
        },
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
