import { getDataSource } from '#/database/data-source'
import { logger } from '@mxvincent/telemetry'
import { initializeDataSource, teardownDataSource } from '@mxvincent/typeorm'

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
		logger.error(error)
	}
	logger.info('[JestSetup] completed')
}
