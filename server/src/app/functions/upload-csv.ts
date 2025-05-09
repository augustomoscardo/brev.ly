import { Readable } from 'node:stream'
import { z } from 'zod'

const uploadFileInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UplaodImageInput = z.input<typeof uploadFileInput>

export async function uploadCsv(input: UplaodImageInput) {
  const { fileName, contentType, contentStream } = uploadFileInput.parse(input)
}
