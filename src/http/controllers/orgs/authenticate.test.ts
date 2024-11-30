import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe('E2E: Authenticate', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be possible to authenticate as an org', async () => {
    const state = await prisma.state.create({
      data: {
        name: 'Minas Gerais',
        uf: 'MG',
      },
    })

    await request(app.server)
      .post('/orgs')
      .send({
        name: 'Pet Lovers',
        email: 'petlovers@org.com',
        password: '123456',
        whatsapp: '32999999999',
        address: {
          zipCode: '36000000',
          stateId: state.id,
          cityName: 'Juiz de Fora',
          street: 'Avenida Rio Branco',
          district: 'Centro',
          number: '0',
          complement: 'Algum complemento',
        },
      })

    const response = await request(app.server).post('/sessions').send({
      email: 'petlovers@org.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
