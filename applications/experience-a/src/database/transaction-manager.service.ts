import { logger } from '@mxvincent/telemetry'
import { DataSource, EntityManager, IsolationLevel, QueryRunner } from '@mxvincent/typeorm'
import { Injectable, Scope } from '@nestjs/common'
import invariant from 'tiny-invariant'

export class StartDatabaseTransactionOptions {
	isolationLevel?: IsolationLevel
}

const prefix = (message: string) => `[TransactionManager] ${message}`

@Injectable({ scope: Scope.REQUEST })
export class TransactionManager {
	queryRunner?: QueryRunner

	constructor(readonly dataSource: DataSource) {}

	get invariantQueryRunner(): QueryRunner {
		invariant(this.queryRunner, prefix('Transaction is not started.'))
		return this.queryRunner
	}

	get hasActiveTransaction(): boolean {
		return this.queryRunner?.isTransactionActive === true
	}

	get manager(): EntityManager | undefined {
		return this.queryRunner?.manager
	}

	private async releaseQueryRunner() {
		await this.invariantQueryRunner.release()
		logger.debug(prefix('Transaction QueryRunner released.'))
		this.queryRunner = undefined
	}

	async start(options = new StartDatabaseTransactionOptions()): Promise<void> {
		if (this.hasActiveTransaction) {
			throw new Error(prefix('Transaction is already started.'))
		}
		this.queryRunner = this.dataSource.createQueryRunner()
		await this.queryRunner.startTransaction(options.isolationLevel)
		logger.debug(prefix('Transaction started.'))
	}

	async commit(): Promise<void> {
		await this.invariantQueryRunner.commitTransaction()
		logger.debug(prefix(`Transaction commit completed.`))
		await this.releaseQueryRunner()
	}

	async rollback(): Promise<void> {
		await this.invariantQueryRunner.rollbackTransaction()
		logger.debug(prefix('Transaction rollback completed.'))
		await this.releaseQueryRunner()
	}
}
