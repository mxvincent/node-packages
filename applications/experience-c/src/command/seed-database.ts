import { config } from '#/core/config'
import { accountDataSource } from '#/database/data-source'
import { seedAccountDatabase } from '#/database/seed'
import { logger, setLogLevel } from '@mxvincent/telemetry'
import { initializeDataSource, teardownDataSource } from '@mxvincent/typeorm'

async function main(): Promise<void> {
	setLogLevel(config.app.logLevel)
	await initializeDataSource(accountDataSource, { runMigrations: true })
	await seedAccountDatabase(accountDataSource)
	await teardownDataSource(accountDataSource)
}

if (require.main === module) {
	main().catch((error) => {
		logger.fatal(error)
		process.exit(1)
	})
}
