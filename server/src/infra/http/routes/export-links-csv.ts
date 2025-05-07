import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const exportLinksCsvRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/links/export',
    {
      schema: {
        response: {
          200: z.object({
            message: z.string().describe('Links exported successfully'),
          }),
        },
      },
    },
    async (request, reply) => {
      const links = await db.select().from(schema.links)

      return reply.status(200).send({ message: 'Links exported successfully' })
    }
  )
}
