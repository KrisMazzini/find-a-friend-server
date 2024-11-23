import { Address, City, Prisma, State } from '@prisma/client'

export interface AddressesRepository {
  createCity(name: string, stateId: string): Promise<City>

  createAddress(data: Prisma.AddressUncheckedCreateInput): Promise<Address>

  findStateById(id: string): Promise<State>

  findCityByNameAndStateId(name: string, stateId: string): Promise<City>
}
