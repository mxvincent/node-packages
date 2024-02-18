import { config } from '@app/config'
import { seedAccountDatabase } from '@database/database-seed.service'
import { dataSource } from '@database/database.service'
import { logger, setLogLevel } from '@mxvincent/logger'
import { initializeDataSource } from '@mxvincent/typeorm'

async function main(): Promise<void> {
	setLogLevel(config.logLevel)
	await initializeDataSource(dataSource, { runMigrations: true })
	await seedAccountDatabase(dataSource)
}

if (require.main === module) {
	main().catch((error) => {
		logger.fatal(error)
		process.exit(1)
	})
}
