import fastify from 'fastify'

import { env } from './env'

const app = fastify()

app.get('/hello', async (_, reply) => {
  return reply.status(200).send({
    message: 'Hello, world.',
  })
})

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('🚀 HTTP Server Running!')
  })
