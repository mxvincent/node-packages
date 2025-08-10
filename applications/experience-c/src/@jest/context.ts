import { contextManager, ContextValues } from '#/core/context'
import { getDataSource } from '#/database/data-source'
import { initializeDataSource, teardownDataSource, TypeormDatabaseContext } from '@mxvincent/typeorm'

export interface TestingContextStrategy {
	isolationLevel: 'test' | 'suite'
}

export const useTestingContext = (strategy?: TestingContextStrategy): ContextValues => {
	const dataSource = getDataSource()
	if (dataSource.isInitialized) {
		throw new Error('Database should not be initialized outside of test asyncContext helper')
	}

	const isolationLevel = strategy?.isolationLevel ?? 'test'

	const database = new TypeormDatabaseContext(dataSource)
	const context = contextManager.enter({ database })

	beforeAll(async () => {
		await initializeDataSource(dataSource, { runMigrations: false })
		if (isolationLevel === 'suite') {
			await database.startTransaction()
		}
	})

	afterAll(async () => {
		if (isolationLevel === 'suite') {
			await database.rollbackTransaction()
		}
		contextManager.exit()
		await teardownDataSource(dataSource)
	})

	if (isolationLevel === 'test') {
		beforeEach(async () => database.startTransaction())
		afterEach(async () => database.rollbackTransaction())
	}

	return context
}
