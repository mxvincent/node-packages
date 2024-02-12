import { config } from '@app/config'
import { createDataSource, DatabaseContext } from '@database/database.service'
import { closeAllDatabaseConnections, DataSource, initializeDataSource } from '@mxvincent/typeorm'
import { testConfig } from './config'

/**
 * Workers database template name
 */
export const templateDatabaseName = `test-account-template`

/**
 * Generate database name for test workers
 */
export const getWorkerDatabaseName = (workerId: string | number): string => `test-account-${workerId}`

/**
 * Truncate all table
 */
export const truncateAllTables = async (dataSource: DataSource) => {
	await dataSource.manager.query(`SELECT truncate_tables('${config.database.username}');`)
}

/**
 * Configure database testing strategy
 */
export interface DatabaseTestingStrategy {
	isolationLevel: 'test' | 'worker'
}

/**
 * Use isolated database for testing
 * Database operations are executed in a transaction and automatically reverted
 */
export const useIsolatedDatabase = (options?: Partial<DatabaseTestingStrategy>): DatabaseContext => {
	const strategy: DatabaseTestingStrategy = {
		isolationLevel: options?.isolationLevel ?? 'test'
	}

	const context = new DatabaseContext(
		createDataSource({
			database: getWorkerDatabaseName(testConfig.workerId)
		})
	)

	beforeAll(async () => {
		await initializeDataSource(context.dataSource, { runMigrations: false })
		if (strategy.isolationLevel === 'worker') {
			await context.transaction.start()
		}
	})

	afterAll(async () => {
		if (strategy.isolationLevel === 'worker') {
			await context.transaction.rollback()
		}
		await closeAllDatabaseConnections(context.dataSource)
	})

	if (strategy.isolationLevel === 'test') {
		beforeEach(async () => await context.transaction.start())
		afterEach(async () => await context.transaction.rollback())
	}

	return context
}
