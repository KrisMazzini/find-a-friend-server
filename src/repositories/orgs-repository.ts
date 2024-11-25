import { Org, Prisma } from '@prisma/client'

export interface OrgsRepository {
  create(data: Prisma.OrgUncheckedCreateInput): Promise<Org>

  findById(id: string): Promise<Org | null>

  findByEmail(email: string): Promise<Org | null>
}
