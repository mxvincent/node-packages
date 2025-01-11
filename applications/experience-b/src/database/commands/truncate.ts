import { database, postgresClient } from '#/database/client'
import { logger, serializers } from '@mxvincent/telemetry'
import { sql } from 'drizzle-orm'

const truncate = async () => {
	await database.execute(sql`TRUNCATE public.organization CASCADE `)
	await database.execute(sql`TRUNCATE public.user CASCADE `)

	console.info('Database content deleted')

	await postgresClient.end()

	process.exit(0)
}

truncate().catch((error) => {
	logger.fatal({ error: serializers.error(error) })
	process.exit(1)
})
