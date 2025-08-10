import { logger } from '@mxvincent/telemetry'
import { EntityManager, ObjectLiteral, ObjectType, QueryRunner } from 'typeorm'
import { PostgresDatabaseSource } from '../helpers/data-source'
import { TypeormRepository } from './repository'

export class TypeormDatabaseContext {
	readonly dataSource: PostgresDatabaseSource
	readonly useInheritedQueryRunner: boolean
	private queryRunner?: QueryRunner

	constructor(dataSource: PostgresDatabaseSource, options?: { queryRunner?: QueryRunner }) {
		this.dataSource = dataSource
		if (options?.queryRunner) {
			this.useInheritedQueryRunner = true
			this.queryRunner = options.queryRunner
			logger.debug('Query runner reused.')
		} else {
			this.useInheritedQueryRunner = false
		}
	}

	get manager(): EntityManager {
		return this.queryRunner?.manager ?? this.dataSource.manager
	}

	async startTransaction() {
		if (!this.queryRunner) {
			this.queryRunner = this.dataSource.createQueryRunner()
		}
		if (this.queryRunner.isTransactionActive) {
			throw new Error('Transaction already started.')
		}
		await this.queryRunner.startTransaction()
		logger.debug('Transaction started.')
	}

	async commitTransaction() {
		if (this.queryRunner?.isTransactionActive) {
			await this.queryRunner.commitTransaction()
			logger.debug('Transaction commit completed.')
			await this.releaseQueryRunner()
		} else {
			logger.debug('There is no transaction to commit.')
		}
	}

	async rollbackTransaction() {
		if (this.queryRunner?.isTransactionActive) {
			try {
				await this.queryRunner.rollbackTransaction()
				logger.debug('Transaction rollback completed.')
				await this.releaseQueryRunner()
			} catch (error) {
				logger.debug({ error }, 'Transaction rollback failed.')
			}
		} else {
			logger.debug('There is no transaction to rollback.')
		}
	}

	async query<T = unknown>(query: string, parameters?: unknown[]): Promise<T> {
		return this.dataSource.query(query, parameters, this.queryRunner)
	}

	async transaction<TResult>(runInTransaction: (manager: EntityManager) => Promise<TResult>): Promise<TResult> {
		await this.startTransaction()
		try {
			const result = await runInTransaction(this.manager)
			await this.commitTransaction()
			return result
		} catch (error) {
			await this.rollbackTransaction()
			throw error
		}
	}

	repository<TEntity extends ObjectLiteral>(entity: ObjectType<TEntity>): TypeormRepository<TEntity> {
		return new TypeormRepository(this.manager, entity)
	}

	private async releaseQueryRunner(): Promise<void> {
		if (!this.queryRunner || this.useInheritedQueryRunner) {
			return
		}
		if (this.queryRunner.isReleased) {
			logger.debug('Transaction query runner is already released.')
		} else {
			await this.queryRunner.release()
			logger.debug('Transaction query runner released.')
		}
		this.queryRunner = undefined
	}
}
