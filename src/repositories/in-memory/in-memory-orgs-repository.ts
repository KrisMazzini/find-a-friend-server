import { randomUUID } from 'node:crypto'

import { Org, Prisma } from '@prisma/client'

import { OrgsRepository } from '../orgs-repository'

export class InMemoryOrgsRepository implements OrgsRepository {
  public orgs: Org[] = []

  async create(data: Prisma.OrgUncheckedCreateInput) {
    const org: Org = {
      id: randomUUID(),
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

  async findByEmail(email: string) {
    const org = this.orgs.find((org) => org.email === email)

    return org ?? null
  }
}
