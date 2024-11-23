import { Address } from '@prisma/client'

import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { AddressesRepository } from '@/repositories/addresses-repository'

export interface CreateAddressUseCaseRequest {
  zipCode: string
  stateId: string
  cityName: string
  street: string
  district: string
  number: string
  complement?: string
}

interface CreateAddressUseCaseResponse {
  address: Address
}

export class CreateAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute({
    zipCode,
    stateId,
    cityName,
    street,
    district,
    number,
    complement,
  }: CreateAddressUseCaseRequest): Promise<CreateAddressUseCaseResponse> {
    const state = await this.addressesRepository.findStateById(stateId)

    if (!state) {
      throw new ResourceNotFoundError()
    }

    let city = await this.addressesRepository.findCityByNameAndStateId(
      cityName,
      state.id,
    )

    if (!city) {
      city = await this.addressesRepository.createCity(cityName, state.id)
    }

    const address = await this.addressesRepository.createAddress({
      zip_code: zipCode,
      state_id: state.id,
      city_id: city.id,
      street,
      district,
      number,
      complement,
    })

    return { address }
  }
}
