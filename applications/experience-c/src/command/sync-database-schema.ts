import { getDataSource } from '#/database/data-source'
import { logger } from '@mxvincent/telemetry'
import { initializeDataSource } from '@mxvincent/typeorm'

async function syncDatabaseSchema() {
	await initializeDataSource(getDataSource(), { runMigrations: true })
}

syncDatabaseSchema().catch((error) => logger.error({ error }))
