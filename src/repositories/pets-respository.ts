import {
  AgeRange,
  EnergyLevel,
  IndependencyLevel,
  Pet,
  Prisma,
  Size,
} from '@prisma/client'

export interface FindAllParams {
  cityId: string
  ageRange?: AgeRange
  size?: Size
  environmentSize?: Size
  energyLevel?: EnergyLevel
  independencyLevel?: IndependencyLevel
  page: number
}

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>

  findById(id: string): Promise<Pet | null>

  findAll(data: FindAllParams): Promise<Pet[]>
}
