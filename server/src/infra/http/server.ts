import { createLinkRoute } from '@/infra/http/routes/create-link'
import { deleteLinkRoute } from '@/infra/http/routes/delete-link'
import { exportLinksRoute } from '@/infra/http/routes/export-links'
import { getLinkRoute } from '@/infra/http/routes/get-link'
import { getLinksRoute } from '@/infra/http/routes/get-links'
import { fastifyCors } from '@fastify/cors'
import fastify from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

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
app.register(exportLinksRoute)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
