import { TypeormDatabaseContext } from '../../adapters/context'
import { initializeDataSource, teardownDataSource } from '../../helpers/data-source'
import { testDatasource } from './data-source'

export { Author, DateContainer, Post } from './entities'
export { factories } from './factories'

export const useDatabaseContext = (options?: { isolationLevel?: 'group' | 'test' }): TypeormDatabaseContext => {
	const database = new TypeormDatabaseContext(testDatasource)

	beforeAll(async () => {
		await initializeDataSource(testDatasource)
		await testDatasource.synchronize()
	})

	useDatabaseTransaction(database, options?.isolationLevel ?? 'group')

	afterAll(async () => {
		await teardownDataSource(testDatasource, 500)
	})

	return database
}

export const useDatabaseTransaction = (database: TypeormDatabaseContext, isolation: 'group' | 'test' = 'test') => {
	if (isolation === 'group') {
		beforeAll(() => database.startTransaction())
		afterAll(() => database.rollbackTransaction())
	}

	if (isolation === 'test') {
		beforeEach(() => database.startTransaction())
		afterEach(() => database.rollbackTransaction())
	}
}
