import { config } from '@app/config'
import { accountDataSource } from '@database/database.service'
import { logger, setLogLevel } from '@mxvincent/telemetry'
import { initializeDataSource } from '@mxvincent/typeorm'

async function main(): Promise<void> {
	setLogLevel(config.logLevel)
	await initializeDataSource(accountDataSource, { runMigrations: false })
}

if (require.main === module) {
	main().catch((error) => {
		logger.fatal(error)
		process.exit(1)
	})
}