import { database } from '@database/database'
import { count } from 'drizzle-orm'
import { PgTableWithColumns } from 'drizzle-orm/pg-core'
import { SQL } from 'drizzle-orm/sql/sql'

export const countRows = async <T extends PgTableWithColumns<any>>(table: T, where?: SQL): Promise<number> => {
	const result = await database.select({ count: count() }).from(table).where(where)
	return result[0].count
}
