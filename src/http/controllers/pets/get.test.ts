import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe('E2E: Get Pet', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be possible to get a pet', async () => {
    const state = await prisma.state.create({
      data: {
        name: 'Minas Gerais',
        uf: 'MG',
      },
    })

    const city = await prisma.city.create({
      data: {
        name: 'Juiz de Fora',
        state_id: state.id,
      },
    })

    const address = await prisma.address.create({
      data: {
        state_id: state.id,
        city_id: city.id,
        zip_code: '36000000',
        street: 'Avenida Rio Branco',
        district: 'Centro',
        number: '0',
      },
    })

    const org = await prisma.org.create({
      data: {
        address_id: address.id,
        name: 'Pet Lovers',
        email: 'petlovers@org.com',
        whatsapp: '32988887777',
        password_hash: '123456789',
      },
    })

    const pet = await prisma.pet.create({
      data: {
        name: 'Heine',
        about: 'A cute Yorkshire puppy',
        age_range: 'INFANT',

        energy_level: 'HIGH',
        environment_size: 'MEDIUM',
        independency_level: 'MODERATE',
        size: 'SMALL',
        org_id: org.id,
      },
    })

    const response = await request(app.server).get(`/pets/${pet.id}`).send()

    expect(response.status).toBe(200)
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        id: pet.id,
      }),
    )
  })
})
