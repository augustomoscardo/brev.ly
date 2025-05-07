import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const deleteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/links',
    {
      schema: {
        body: z.object({
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
      // Logic to delete the link from the database
      const { linkId } = request.body

      console.log(linkId)

      const linkDeleted = await db.delete(schema.links).where(eq(schema.links.id, linkId))
      console.log(linkDeleted)

      // This is a placeholder and should be replaced with actual database logic
      return reply.status(200).send({ message: 'Link deleted successfully' })
    }
  )
}
