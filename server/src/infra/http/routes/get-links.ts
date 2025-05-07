import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { desc } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getLinksRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/links',
    {
      schema: {
        response: {
          200: z.array(
            z
              .object({
                id: z.string().uuid().describe('Link ID'),
                originalUrl: z.string().url().describe('Original URL'),
                shortUrl: z.string().describe('Short URL'),
                accessCount: z.number().describe('Access count'),
                createdAt: z.date().describe('Creation date'),
              })
              .describe('Links list')
          ),
        },
      },
    },
    async (request, reply) => {
      const links = await db.select().from(schema.links).orderBy(desc(schema.links.createdAt))

      return reply.status(200).send(links)
    }
  )
}
