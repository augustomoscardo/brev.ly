import { randomUUID } from 'node:crypto'
import { PassThrough } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { env } from '@/env'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { r2 } from '@/infra/storage/client'
import { Upload } from '@aws-sdk/lib-storage'
import { stringify } from 'csv-stringify'
import { count } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { Pool } from 'pg'
import QueryStream from 'pg-query-stream'
import { z } from 'zod'

const pgPool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const exportLinksCsvRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/export-links',
    {
      schema: {
        response: {
          200: z.object({
            message: z.string().describe('Links exported successfully'),
            fileUrl: z.string().describe('URL of the exported CSV file in Cloudfare R2'),
          }),
          500: z.object({
            message: z.string().describe('Internal server error'),
          }),
        },
      },
    },
    async (request, reply) => {
      const pgClient = await pgPool.connect()

      try {
        const [query] = await db.select({ linksCount: count() }).from(schema.links)
        const { linksCount } = query

        if (linksCount <= 0) {
          return reply.status(400).send({ message: 'There is no link to be exported' })
        }

        const queryStream = new QueryStream(`
          SELECT  
            "id", "original_url", "short_url", "access_count", "created_at" 
          FROM links  
        `)

        const dbStream = pgClient.query(queryStream)

        const csvStream = stringify({
          delimiter: ';',
          header: true,
          columns: [
            { key: 'id', header: 'id' },
            { key: 'original_url', header: 'originalUrl' },
            { key: 'short_url', header: 'shortUrl' },
            { key: 'access_count', header: 'accessCount' },
            { key: 'created_at', header: 'createdAt' },
          ],
        })

        const passThrough = new PassThrough()
        const fileKey = `exports/links-${randomUUID()}.csv`

        const upload = new Upload({
          client: r2,
          params: {
            Bucket: env.CLOUDFARE_BUCKET,
            Key: fileKey,
            Body: passThrough,
            ContentType: 'text/csv',
          },
        })

        const uploadPromise = upload.done()

        await pipeline(dbStream, csvStream, passThrough)

        await uploadPromise

        pgClient.release()

        const fileUrl = `${env.CLOUDFARE_PUBLIC_URL}/${fileKey}`

        return reply.status(200).send({ message: 'Links exported successfully', fileUrl })
      } catch (error) {
        pgClient.release()
        console.log(error)

        return reply.status(500).send({ message: 'Internal server error' })
      }
    }
  )
}
