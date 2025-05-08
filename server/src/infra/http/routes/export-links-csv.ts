import { createWriteStream } from 'node:fs'
import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
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
      console.log(readable)

      const exampleStream = new Transform({
        objectMode: true,
        transform(chunk, encoding, callback) {
          // for (const item of chunk) {
          //   this.push(JSON.stringify(item).concat('\n'))
          // }
          this.push(JSON.stringify(chunk).concat('\n'))
          callback()
        },
      })

      await pipeline(readable, exampleStream, createWriteStream('./test.csv'))

      return reply.status(200).send({ message: 'Links exported successfully' })
    }
  )
}
