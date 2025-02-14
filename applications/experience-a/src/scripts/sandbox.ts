import { config } from '#/core/config.service'
import { accountDataSource } from '#/database/database.service'
import { logger, setLogLevel } from '@mxvincent/telemetry'
import { initializeDataSource } from '@mxvincent/typeorm'

async function main(): Promise<void> {
	setLogLevel(config.app.logLevel)
	await initializeDataSource(accountDataSource, { runMigrations: false })
}

if (require.main === module) {
	main().catch((error) => {
		logger.fatal(error)
		process.exit(1)
	})
}
