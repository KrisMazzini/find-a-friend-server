import { Pet } from '@prisma/client'

import { FindAllParams, PetsRepository } from '@/repositories/pets-respository'

type SearchPetsUseCaseRequest = FindAllParams

interface SearchPetsUseCaseResponse {
  pets: Pet[]
}

export class SearchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(
    params: SearchPetsUseCaseRequest,
  ): Promise<SearchPetsUseCaseResponse> {
    const pets = await this.petsRepository.findAll(params)

    return { pets }
  }
}
