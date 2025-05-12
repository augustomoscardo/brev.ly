import { exportLinks } from '@/app/functions/export-links'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { count } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const exportLinksRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/export-links',
    {
      schema: {
        summary: 'Export links to CSV',
        response: {
          200: z.object({
            message: z.string().describe('Links exported successfully'),
            reportUrl: z.string().describe('URL of the exported CSV file in Cloudfare R2'),
          }),
          500: z.object({
            message: z.string().describe('Internal server error'),
          }),
        },
      },
    },
    async (request, reply) => {
      const [{ linksCount }] = await db.select({ linksCount: count() }).from(schema.links)

      if (linksCount <= 0) {
        return reply.status(400).send({ message: 'There is no link to be exported' })
      }

      const { reportUrl } = await exportLinks()

      return reply.status(202).send({
        message: 'Links exported successfully',
        reportUrl,
      })
    }
  )
}
