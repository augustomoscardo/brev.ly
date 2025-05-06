import { randomUUID } from 'node:crypto'
import { integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull().unique(),
  accessCount: integer('access_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
