import { config } from '#/core/config.service'
import { Repository } from '#/database/repository.service'
import { TransactionManager } from '#/database/transaction-manager.service'

import {
	createPostgresDataSource,
	CreatePostgresDataSourceOptions,
	EntityManager,
	ObjectLiteral,
	ObjectType,
	PostgresDatabaseSource
} from '@mxvincent/typeorm'
import { Injectable, Scope } from '@nestjs/common'

export const createDataSource = (configOverrides?: Partial<CreatePostgresDataSourceOptions>) => {
	const extension = __filename.match(/.+\.ts$/) ? 'ts' : 'js'
	return createPostgresDataSource({
		entities: [`${__dirname}/entities/*.${extension}`],
		migrations: [`${__dirname}/migrations/*.${extension}`],
		subscribers: [`${__dirname}/subscribers/*.${extension}`],
		...config.database,
		...configOverrides
	})
}

export const accountDataSource = createDataSource({})
export const getDataSource = () => accountDataSource

@Injectable({ scope: Scope.REQUEST })
export class Database {
	dataSource: PostgresDatabaseSource
	transaction: TransactionManager

	constructor(dataSource: PostgresDatabaseSource) {
		this.dataSource = dataSource
		this.transaction = new TransactionManager(dataSource)
		this.query = this.dataSource.query
	}

	get manager(): EntityManager {
		return this.transaction.manager ?? this.dataSource.manager
	}

	query<T = unknown>(query: string, parameters?: unknown[]): Promise<T> {
		return this.dataSource.query(query, parameters, this.transaction.queryRunner)
	}

	repository<T extends ObjectLiteral>(entity: ObjectType<T>): Repository<T> {
		return new Repository(this, entity)
	}
}
