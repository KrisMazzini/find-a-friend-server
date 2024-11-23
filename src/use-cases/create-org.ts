import { Org } from '@prisma/client'
import { hash } from 'bcryptjs'

import { OrgAlreadyExistsError } from '@/errors/org-already-exists-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { AddressesRepository } from '@/repositories/addresses-repository'
import { OrgsRepository } from '@/repositories/orgs-repository'

interface CreateOrgUseCaseRequest {
  name: string
  email: string
  password: string
  whatsapp: string
  orgAddress: {
    zipCode: string
    stateId: string
    city: string
    street: string
    district: string
    number: string
    complement?: string
  }
}

interface CreateOrgUseCaseResponse {
  org: Org
}

export class CreateOrgUseCase {
  constructor(
    private orgsRepository: OrgsRepository,
    private addressesRepository: AddressesRepository,
  ) {}

  async execute({
    name,
    email,
    whatsapp,
    password,
    orgAddress,
  }: CreateOrgUseCaseRequest): Promise<CreateOrgUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const state = await this.addressesRepository.findStateById(
      orgAddress.stateId,
    )

    if (!state) {
      throw new ResourceNotFoundError()
    }

    let city = await this.addressesRepository.findCityByNameAndStateId(
      orgAddress.city,
      state.id,
    )

    if (!city) {
      city = await this.addressesRepository.createCity(
        orgAddress.city,
        state.id,
      )
    }

    const address = await this.addressesRepository.createAddress({
      zip_code: orgAddress.zipCode,
      state_id: state.id,
      city_id: city.id,
      street: orgAddress.street,
      district: orgAddress.district,
      number: orgAddress.number,
      complement: orgAddress.complement,
    })

    const org = await this.orgsRepository.create({
      name,
      email,
      whatsapp,
      password_hash: await hash(password, 6),
      address_id: address.id,
    })

    return { org }
  }
}
