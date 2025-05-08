import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { PassThrough, Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { env } from '@/env'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { r2 } from '@/infra/storage/client'
import { Upload } from '@aws-sdk/lib-storage'
import { stringify } from 'csv-stringify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const exportLinksCsvRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/export-links',
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

      const readable = Readable.from(links)

      const stream = new Transform({
        objectMode: true,
        transform(chunk, encoding, callback) {
          // for (const item of chunk) {
          //   this.push(JSON.stringify(item).concat('\n'))
          // }
          this.push(chunk)
          callback()
        },
      })

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

      const upload = new Upload({
        client: r2,
        params: {
          Bucket: env.CLOUDFARE_BUCKET,
          Key: `exports/links-${randomUUID()}.csv`,
          Body: csvStream,
          ContentType: 'text/csv',
        },
      })

      const uploadPromise = upload.done()

      await pipeline(readable, stream, csvStream, passThrough)

      await uploadPromise

      console.log(JSON.stringify(r2, null, 2))

      // await pipeline(
      //   readable,
      //   exampleStream,
      //   stringify({
      //     delimiter: ',',
      //     header: true,
      //     columns: [
      //       { key: 'id', header: 'id' },
      //       { key: 'originalUrl', header: 'originalUrl' },
      //       { key: 'shortUrl', header: 'shortUrl' },
      //       { key: 'accessCount', header: 'accessCount' },
      //       { key: 'createdAt', header: 'createdAt' },
      //     ],
      //   }),
      //   createWriteStream('./test.csv', 'utf-8')
      // )

      return reply.status(200).send({ message: 'Links exported successfully' })
    }
  )
}
