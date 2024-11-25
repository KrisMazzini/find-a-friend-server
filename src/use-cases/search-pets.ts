import { Pet } from '@prisma/client'

import { PetsRepository } from '@/repositories/pets-respository'

interface SearchPetsUseCaseRequest {
  cityId: string
  page: number
}

interface SearchPetsUseCaseResponse {
  pets: Pet[]
}

export class SearchPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    cityId,
    page,
  }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
    const pets = await this.petsRepository.findAll({ cityId, page })

    return { pets }
  }
}
