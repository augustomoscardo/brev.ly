import { randomUUID } from 'node:crypto'
import { PassThrough } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { env } from '@/env'
import { r2 } from '@/infra/storage/client'
import { Upload } from '@aws-sdk/lib-storage'
import { stringify } from 'csv-stringify'
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
        const queryStream = new QueryStream(`
          SELECT  
            id, "original_url" as originalUrl, "short_url" as shortUrl, "access_count" as accessCount, "created_at" as createdAt 
          FROM links  
        `)
        console.log(queryStream)

        const dbStream = pgClient.query(queryStream)
        console.log(dbStream)

        const csvStream = stringify({
          delimiter: ';',
          header: true,
          columns: [
            { key: 'id', header: 'id' },
            { key: 'originalUrl', header: 'originalUrl' },
            { key: 'shortUrl', header: 'shortUrl' },
            { key: 'accessCount', header: 'accessCount' },
            { key: 'createdAt', header: 'createdAt' },
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
        return reply.status(500).send({ message: 'Internal server error' })
      } finally {
        pgClient.release()
      }
    }
  )
}
