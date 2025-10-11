import { Database, getDataSource } from '#/database/database.service'
import { initializeDataSource, teardownDataSource } from '@mxvincent/typeorm'

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
export const useIsolatedDatabase = (options?: Partial<DatabaseTestingStrategy>): Database => {
	const strategy: DatabaseTestingStrategy = {
		isolationLevel: options?.isolationLevel ?? 'test'
	}

	const context = new Database(getDataSource())

	beforeAll(async () => {
		await initializeDataSource(context.dataSource)
		if (strategy.isolationLevel === 'worker') {
			await context.transaction.start()
		}
	})

	afterAll(async () => {
		if (strategy.isolationLevel === 'worker') {
			await context.transaction.rollback()
		}
		await teardownDataSource(context.dataSource)
	})

	if (strategy.isolationLevel === 'test') {
		beforeEach(async () => await context.transaction.start())
		afterEach(async () => await context.transaction.rollback())
	}

	return context
}
