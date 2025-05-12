import { Transform } from 'node:stream'
import { PassThrough } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { stringify } from 'csv-stringify'

type ExportLinksOutput = {
  reportUrl: string
}

export async function exportLinks(): Promise<ExportLinksOutput> {
  const { sql, params } = db.select().from(schema.links).toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(2)

  const csv = stringify({
    delimiter: ';',
    header: true,
    columns: [
      { key: 'id', header: 'id' },
      { key: 'original_url', header: 'Url' },
      { key: 'short_url', header: 'Short Url' },
      { key: 'access_count', header: 'Access Count' },
      { key: 'created_at', header: 'Created at' },
    ],
  })

  const uploadFileToStorageStream = new PassThrough()

  /**
   * @param chunks - An array of objects, where each object may optionally have a
   * `created_at` property of type string.
   * @param encoding - The encoding type.
   * @param callback - A callback function to signal the completion of the transformation.
   */
  const convertToCsvPipeline = await pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks: Array<{ created_at?: string }>, encoding, callback) {
        for (const chunk of chunks) {
          if (chunk.created_at) {
            chunk.created_at = new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }).format(new Date(chunk.created_at))
          }

          this.push(chunk)
        }

        callback()
      },
    }),
    csv,
    uploadFileToStorageStream
  )

  // Send file to Cloudflare R2
  const uploadToStorage = uploadFileToStorage({
    contentType: 'text/csv',
    folder: 'exports',
    fileName: `${new Date().toISOString()}-links.csv`,
    contentStream: uploadFileToStorageStream,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCsvPipeline])

  return { reportUrl: url }
}
