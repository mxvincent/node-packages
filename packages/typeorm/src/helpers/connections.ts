import { logger } from '@mxvincent/logger'
import { isString } from '@mxvincent/utils'
import { pick } from 'ramda'
import { DataSource } from 'typeorm'
import { PinoLoggerAdapter } from '../adapters/PinoLoggerAdapter'
import { runMigrations } from './migrations'
import { setPrimaryKeyColumns } from './primaryKey'

export interface InitializeDataSourceOptions {
	runMigrations: boolean
}

export const initializeDataSource = async (
	dataSource: DataSource,
	options?: InitializeDataSourceOptions
): Promise<DataSource> => {
	if (dataSource.isInitialized) {
		throw new Error(`DataSource ${dataSource.options.database} is already initialized`)
	}

	await dataSource.initialize()

	// configure primary keys for pagination helpers
	for (const entity of dataSource.entityMetadatas) {
		const name = isString(entity.target) ? entity.target : entity.target.name
		if (typeof entity.target !== 'function') {
			logger.warn(`[Database] Can not set primary key columns when entity target is string (entity=${name})`)
			continue
		}

		setPrimaryKeyColumns(
			entity.target,
			entity.primaryColumns.map((column) => column.propertyName)
		)
	}

	// optionally run database migrations
	if (options?.runMigrations) {
		await runMigrations(dataSource)
	}

	logger.info(
		{
			dataSource: pick(['database', 'username', 'host', 'port', 'type'], dataSource.options)
		},
		`[Database] Datasource initialized`
	)

	return dataSource
}

export const closeAllDatabaseConnections = async (dataSource: DataSource): Promise<void> => {
	if (dataSource.isInitialized) {
		await dataSource.destroy()
	}
	logger.info(`[Database] Close all database connections (database=${dataSource.options.database})`)
}

export type CreatePostgresDataSourceOptions = {
	host?: string
	port?: number
	database: string
	username: string
	password: string
	slowQueryThresholdInMs?: number
	entities?: string[]
	migrations?: string[]
	subscribers?: string[]
}

export const createPostgresDataSource = (options: CreatePostgresDataSourceOptions): DataSource => {
	return new DataSource({
		schema: 'public',
		type: 'postgres',
		host: options.host ?? '127.0.0.1',
		port: options.port ?? 5432,
		database: options.database,
		username: options.username,
		password: options.password,
		entities: options.entities ?? [],
		migrations: options.migrations ?? [],
		subscribers: options.subscribers ?? [],
		logger: new PinoLoggerAdapter(),
		logging: ['info', 'log', 'error', 'warn', 'query'],
		migrationsTableName: '@migration',
		metadataTableName: '@metadata',
		maxQueryExecutionTime: options.slowQueryThresholdInMs ?? 1000,
		migrationsRun: false,
		synchronize: false
	})
}
