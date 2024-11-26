import { randomUUID } from 'node:crypto'

import { Org, Prisma } from '@prisma/client'

import { OrgsRepository } from '../orgs-repository'
import { InMemoryAddressesRepository } from './in-memory-addresses-repository'

export class InMemoryOrgsRepository implements OrgsRepository {
  public orgs: Org[] = []

  constructor(private addressesRespository?: InMemoryAddressesRepository) {}

  async create(data: Prisma.OrgUncheckedCreateInput) {
    const org: Org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      password_hash: data.password_hash,
      address_id: data.address_id,
      created_at: new Date(),
    }

    this.orgs.push(org)

    return org
  }

  async findById(id: string) {
    const org = this.orgs.find((org) => org.id === id)

    return org ?? null
  }

  async findByEmail(email: string) {
    const org = this.orgs.find((org) => org.email === email)

    return org ?? null
  }

  async findManyByCityId(cityId: string) {
    if (!this.addressesRespository) {
      throw new Error('Please provide an addresses repository.')
    }

    const addressesByCity = this.addressesRespository.addresses.filter(
      (address) => address.city_id === cityId,
    )

    const addressIds = new Set(addressesByCity.map((address) => address.id))

    const orgs = this.orgs.filter((org) => addressIds.has(org.address_id))

    return orgs ?? []
  }
}
