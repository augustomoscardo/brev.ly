import { randomUUID } from 'node:crypto'
import { pgTable } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {})
