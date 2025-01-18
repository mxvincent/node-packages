import { database } from '#/database/client'
import { count, TableConfig } from 'drizzle-orm'
import { PgTableWithColumns } from 'drizzle-orm/pg-core'
import { SQL } from 'drizzle-orm/sql/sql'

export const countRows = async <T extends PgTableWithColumns<TableConfig>>(table: T, where?: SQL): Promise<number> => {
	const result = await database.select({ count: count() }).from(table).where(where)
	return result[0].count
}
