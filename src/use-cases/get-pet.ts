import { Pet } from '@prisma/client'

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { PetsRepository } from '@/repositories/pets-respository'

interface GetPetUseCaseRequest {
  petId: string
}

interface GetPetUseCaseResponse {
  pet: Pet
}

export class GetPetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    petId,
  }: GetPetUseCaseRequest): Promise<GetPetUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new ResourceNotFoundError('Pet')
    }

    return { pet }
  }
}
