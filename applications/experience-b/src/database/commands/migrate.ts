import { database, postgresClient } from '@database/database'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import * as path from 'node:path'

try {
	await migrate(database, { migrationsFolder: path.resolve('database/migrations') })
	console.log('database migrated')
} catch (error) {
	console.error(error)
} finally {
	await postgresClient.end()
}
