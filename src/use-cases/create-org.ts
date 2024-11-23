import { Org } from '@prisma/client'
import { hash } from 'bcryptjs'

import { OrgAlreadyExistsError } from '@/errors/org-already-exists-error'
import { AddressesRepository } from '@/repositories/addresses-repository'
import { OrgsRepository } from '@/repositories/orgs-repository'

import {
  CreateAddressUseCase,
  CreateAddressUseCaseRequest,
} from './create-address'

interface CreateOrgUseCaseRequest {
  name: string
  email: string
  password: string
  whatsapp: string
  orgAddress: CreateAddressUseCaseRequest
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

    const createAddressUseCase = new CreateAddressUseCase(
      this.addressesRepository,
    )

    const { address } = await createAddressUseCase.execute(orgAddress)

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
