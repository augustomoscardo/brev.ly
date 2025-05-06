import { randomUUID } from 'node:crypto'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const linksRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/links',
    {
      schema: {
        body: z.object({
          originalUrl: z.string().url(),
          shortUrl: z.string().url(),
        }),
        response: {
          201: z
            .object({
              linkId: z.string().uuid().describe('New link ID'),
            })
            .describe('Link created'),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body

      return reply.status(201).send({
        linkId: randomUUID(),
      })
    }
  )
}
