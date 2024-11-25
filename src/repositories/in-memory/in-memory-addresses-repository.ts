import { randomUUID } from 'node:crypto'

import { Address, City, Prisma, State } from '@prisma/client'

import { AddressesRepository } from '../addresses-repository'

export class InMemoryAddressesRepository implements AddressesRepository {
  public states: State[] = []
  public cities: City[] = []
  public addresses: Address[] = []

  async createCity(name: string, stateId: string) {
    const city: City = {
      id: randomUUID(),
      state_id: stateId,
      name,
    }

    this.cities.push(city)

    return city
  }

  async createAddress(data: Prisma.AddressUncheckedCreateInput) {
    const address: Address = {
      id: data.id ?? randomUUID(),
      zip_code: data.zip_code,
      state_id: data.state_id,
      city_id: data.city_id,
      street: data.street,
      district: data.district,
      number: data.number,
      complement: data.complement ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.addresses.push(address)

    return address
  }

  async findStateById(id: string) {
    const state = this.states.find((state) => state.id === id)

    return state ?? null
  }

  async findCityByNameAndStateId(name: string, stateId: string) {
    const city = this.cities.find(
      (city) => city.name === name && city.state_id === stateId,
    )

    return city ?? null
  }
}
