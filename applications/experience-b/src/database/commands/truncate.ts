import { database, postgresClient } from '@database/client'
import { logger } from '@mxvincent/telemetry'
import { sql } from 'drizzle-orm'

try {
	await database.execute(sql`TRUNCATE public.organization CASCADE `)
	await database.execute(sql`TRUNCATE public.user CASCADE `)
	console.info('Database content deleted')
} catch (error) {
	logger.error(error)
} finally {
	await postgresClient.end()
	process.exit(0)
}
