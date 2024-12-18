import { database, postgresClient } from '@database/database'
import { logger } from '@mxvincent/telemetry'
import { sql } from 'drizzle-orm'

try {
	await database.execute(sql`truncate public.organization cascade `)
	await database.execute(sql`truncate public.user cascade `)
	console.info('Database content deleted')
} catch (error) {
	logger.error(error)
} finally {
	await postgresClient.end()
	process.exit(0)
}
