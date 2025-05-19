import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const deleteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/links/:linkId',
    {
      schema: {
        params: z.object({
          linkId: z.string().uuid().describe('Link ID to delete'),
        }),
        response: {
          200: z.object({
            message: z.string().describe('Link deleted successfully'),
          }),
          404: z.object({
            message: z.string().describe('Link not found'),
          }),
        },
      },
    },
    async (request, reply) => {
      const { linkId } = request.params

      const [linkDeleted] = await db
        .delete(schema.links)
        .where(eq(schema.links.id, linkId))
        .returning()

      if (!linkDeleted) {
        return reply.status(404).send({
          message: 'Link not found',
        })
      }

      return reply.status(200).send({ message: 'Link deleted successfully' })
    }
  )
}
