import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

import { AuthenticateUseCase } from './authenticate'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateUseCase

const email = 'petlovers@org.com'
const password = '123456'

describe('Use Case: Authenticate', async () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()

    orgsRepository.orgs.push({
      id: 'pet-id',
      name: 'Pet Lovers',
      email,
      password_hash: await hash(password, 6),
      whatsapp: '32999999999',
      address_id: 'address-id',
      created_at: new Date(),
    })

    sut = new AuthenticateUseCase(orgsRepository)
  })

  it('should be possible to authenticate as an org', async () => {
    const { org } = await sut.execute({
      email,
      password,
    })

    expect(org).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email,
      }),
    )
  })

  it('should not be possible to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrong_email@test.com',
        password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be possible to authenticate with wrong password', async () => {
    await expect(() =>
      sut.execute({
        email,
        password: 'wrong_password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
