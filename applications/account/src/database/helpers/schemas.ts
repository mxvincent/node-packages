import { generateUUID } from '@mxvincent/core'
import { generateIso8601 } from '@package/incubator'
import { timestamp, uuid } from 'drizzle-orm/pg-core'

export const timestampzOptions = Object.freeze({
	precision: 3,
	withTimezone: true,
	mode: 'string'
})

export const resourceColumns = Object.freeze({
	id: uuid('id').primaryKey().$defaultFn(generateUUID),
	createdAt: timestamp('created_at', timestampzOptions).notNull().$defaultFn(generateIso8601),
	updatedAt: timestamp('updated_at', timestampzOptions)
		.notNull()
		.$defaultFn(generateIso8601)
		.$onUpdate(generateIso8601),
	deletedAt: timestamp('deleted_at', timestampzOptions)
})
