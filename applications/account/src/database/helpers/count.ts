import { database } from '#/database/client'
import { count } from 'drizzle-orm'
import type { PgTable } from 'drizzle-orm/pg-core/table'
import { SQL } from 'drizzle-orm/sql/sql'

export const countRows = async (table: PgTable, where?: SQL): Promise<number> => {
	const result = await database.select({ count: count() }).from(table).where(where)
	return result[0].count
}
