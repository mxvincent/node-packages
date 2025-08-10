import { EntityManager } from 'typeorm'
import { initializeDataSource, teardownDataSource } from '../../helpers/data-source'
import { testDatasource } from './data-source'

export { Author, DateContainer, Post } from './entities'
export { factories } from './factories'

export interface DatabaseInterface {
	readonly manager: EntityManager
	reset(): Promise<void>
}

export const useTestingDatabase = (): DatabaseInterface => {
	const queryRunner = testDatasource.createQueryRunner()

	beforeAll(async () => {
		await initializeDataSource(testDatasource)
		await testDatasource.synchronize()
		await queryRunner.startTransaction()
	})

	afterAll(async () => {
		await queryRunner.rollbackTransaction()
		await teardownDataSource(testDatasource, 500)
	})

	return {
		get manager() {
			return queryRunner.manager
		},
		async reset(): Promise<void> {
			await queryRunner.rollbackTransaction()
			await queryRunner.startTransaction()
		}
	}
}
