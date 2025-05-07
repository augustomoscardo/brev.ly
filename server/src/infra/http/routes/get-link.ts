import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { desc, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getLinkRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/links/:shortUrl',
    {
      schema: {
        params: z.object({
          shortUrl: z.string(),
        }),
        response: {
          200: z
            .object({
              id: z.string().uuid().describe('Link ID'),
              originalUrl: z.string().url().describe('Original URL'),
              shortUrl: z.string().describe('Short URL'),
              accessCount: z.number().describe('Access count'),
              createdAt: z.date().describe('Creation date'),
            })
            .describe('Link'),
          404: z.object({
            message: z.string().describe('Link not found'),
          }),
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.params

      const [link] = await db.select().from(schema.links).where(eq(schema.links.shortUrl, shortUrl))

      if (!link) {
        return reply.status(404).send({
          message: 'Link not found',
        })
      }

      const [updatedLink] = await db
        .update(schema.links)
        .set({
          accessCount: link.accessCount + 1,
        })
        .where(eq(schema.links.id, link.id))
        .returning()

      return reply.status(200).send(updatedLink)
    }
  )
}
