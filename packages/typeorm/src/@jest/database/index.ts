import { includes } from 'ramda'
import { EntityManager, QueryRunner } from 'typeorm'
import { closeAllDatabaseConnections, initializeDataSource, PostgresDatabaseSource } from '../../helpers/connections'
import { testDatasource } from './dataSource'
import { Author } from './entities/Author'
import { DateContainer } from './entities/DateContainer'
import { Post } from './entities/Post'
import { createAuthors, createDateContainers } from './factories'

export { Author, DateContainer, Post }

export const factories = { createAuthors, createDateContainers }

export const setupTestingDatabase = async (database: PostgresDatabaseSource): Promise<QueryRunner> => {
	await initializeDataSource(database)
	if (includes(database.options.type, ['better-sqlite3', 'sqlite'])) {
		await database.synchronize(true)
	}
	const queryRunner = database.createQueryRunner()
	await queryRunner.startTransaction()
	return queryRunner
}

export const teardownTestingDatabase = async (queryRunner: QueryRunner): Promise<void> => {
	await queryRunner.rollbackTransaction()
	await queryRunner.release()
	await closeAllDatabaseConnections(queryRunner.connection)
}

export interface DatabaseInterface {
	readonly manager: EntityManager
	reset(): Promise<void>
}

export const useTestingDatabase = (): DatabaseInterface => {
	let queryRunner: QueryRunner

	beforeAll(async () => {
		queryRunner = await setupTestingDatabase(testDatasource)
	})

	afterAll(async () => {
		await teardownTestingDatabase(queryRunner)
	})

	return {
		get manager() {
			return queryRunner.manager
		},
		async reset(): Promise<void> {
			while (queryRunner.isTransactionActive) {
				await queryRunner.rollbackTransaction()
			}
		}
	}
}
