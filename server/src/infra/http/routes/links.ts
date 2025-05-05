import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const linksRoute: FastifyPluginAsyncZod = async app => {
  app.get('/links', {}, async (request, reply) => {
    return 'Hello world'
  })

  app.post('/links', {}, async (request, reply) => {
    return 'Hello world'
  })
}
