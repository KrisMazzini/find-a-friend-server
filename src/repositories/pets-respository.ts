import { Pet, Prisma } from '@prisma/client'

export interface FindAllParams {
  cityId: string
  ageRange?: string
  size?: string
  environmentSize?: string
  energyLevel?: string
  independencyLevel?: string
  page: number
}

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>

  findAll(data: FindAllParams): Promise<Pet[]>
}
