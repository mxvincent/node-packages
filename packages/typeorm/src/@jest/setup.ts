import { logger } from '@mxvincent/telemetry'
import { initializeDataSource, teardownDataSource } from '../helpers/data-source'
import { testDatasource } from './database/data-source'

export default async function () {
	logger.info('[JestSetup] started')
	try {
		await initializeDataSource(testDatasource, {
			createDatabase: true,
			createSchema: true,
			runMigrations: true
		})
		await teardownDataSource(testDatasource)
	} catch (error) {
		logger.error(error)
	}
	logger.info('[JestSetup] completed')
}
