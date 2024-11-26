import { Pet } from '@prisma/client'

import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetsRepository } from '@/repositories/pets-respository'

interface CreatePetUseCaseRequest {
  orgId: string
  name: string
  about: string
  ageRange: 'INFANT' | 'JUVENILE' | 'ADULT' | 'SENIOR'
  size: 'SMALL' | 'MEDIUM' | 'LARGE'
  environmentSize: 'SMALL' | 'MEDIUM' | 'LARGE'
  energyLevel: 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH'
  independencyLevel: 'LOW' | 'MODERATE' | 'HIGH'
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    orgId,
    name,
    about,
    ageRange,
    size,
    environmentSize,
    energyLevel,
    independencyLevel,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.create({
      org_id: orgId,
      name,
      about,
      age_range: ageRange,
      size,
      environment_size: environmentSize,
      energy_level: energyLevel,
      independency_level: independencyLevel,
    })

    return { pet }
  }
}
