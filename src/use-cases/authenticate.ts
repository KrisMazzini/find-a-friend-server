import { Org } from '@prisma/client'
import { compare } from 'bcryptjs'

import { OrgsRepository } from '@/repositories/orgs-repository'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  org: Org
}

export class AuthenticateUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const org = await this.orgsRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const doPasswordsMatch = await compare(password, org.password_hash)

    if (!doPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    return {
      org,
    }
  }
}
