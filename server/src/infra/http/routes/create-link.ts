import { randomUUID } from 'node:crypto'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const createLinkRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/links',
    {
      schema: {
        body: z.object({
          originalUrl: z
            .string()
            .url()
            .refine(
              url => {
                const { hostname } = new URL(url)

                return hostname.includes('.')
              },
              { message: 'Invalid URL' }
            ),
          shortUrl: z.string(),
        }),
        response: {
          201: z
            .object({
              linkId: z.string().uuid().describe('New link ID'),
            })
            .describe('Link created'),
          409: z.object({
            message: z.string().describe('Link already exists'),
          }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body

      const linkExists = await db
        .select()
        .from(schema.links)
        .where(eq(schema.links.shortUrl, shortUrl))

      console.log(linkExists)

      if (linkExists[0]) {
        return reply.status(409).send({
          message: 'Link already exists',
        })
      }

      await db.insert(schema.links).values({
        originalUrl,
        shortUrl,
      })

      return reply.status(201).send({
        linkId: randomUUID(),
      })
    }
  )
}
