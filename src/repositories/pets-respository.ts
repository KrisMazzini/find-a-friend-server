import { Pet, Prisma } from '@prisma/client'

export interface FindAllParams {
  cityId: string
  ageRange?: 'INFANT' | 'JUVENILE' | 'ADULT' | 'SENIOR'
  size?: 'SMALL' | 'MEDIUM' | 'LARGE'
  environmentSize?: 'SMALL' | 'MEDIUM' | 'LARGE'
  energyLevel?: 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH'
  independencyLevel?: 'LOW' | 'MODERATE' | 'HIGH'
  page: number
}

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>

  findById(id: string): Promise<Pet | null>

  findAll(data: FindAllParams): Promise<Pet[]>
}
