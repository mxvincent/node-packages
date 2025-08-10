import { getDataSource } from '#/database/database.service'
import { logger } from '@mxvincent/telemetry'
import { initializeDataSource, teardownDataSource } from '@mxvincent/typeorm'

logger.level = 'debug'
export default async function () {
	logger.info('[JestSetup] started')
	try {
		const dataSource = getDataSource()
		await initializeDataSource(dataSource, {
			createDatabase: true,
			createSchema: true,
			runMigrations: true
		})
		await teardownDataSource(dataSource)
	} catch (error) {
		logger.fatal(error)
		process.exit(1)
	}
	logger.info('[JestSetup] completed')
}
