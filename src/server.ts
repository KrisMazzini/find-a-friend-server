import fastify from 'fastify'

const app = fastify()

app.get('/hello', async (_, reply) => {
  return reply.status(200).send({
    message: 'Hello, world.',
  })
})

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP Server Running!')
  })
