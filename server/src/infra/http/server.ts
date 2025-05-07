import { createLinkRoute } from '@/infra/http/routes/create-link'
import { deleteLinkRoute } from '@/infra/http/routes/delete-link'
import { fastifyCors } from '@fastify/cors'
import fastify from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { getLinkRoute } from './routes/get-link'
import { getLinksRoute } from './routes/get-links'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, { origin: '*' })

app.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.validation,
    })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error' })
})

app.register(createLinkRoute)
app.register(deleteLinkRoute)
app.register(getLinksRoute)
app.register(getLinkRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
