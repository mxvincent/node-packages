import { isString } from '@mxvincent/core'
import { logger } from '@mxvincent/telemetry'
import { pick } from 'ramda'
import { DataSource } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { PinoLoggerAdapter } from '../adapters/PinoLoggerAdapter'
import { runMigrations } from './migrations'
import { setPrimaryKeyColumns } from './primaryKey'

export interface InitializeDataSourceOptions {
	runMigrations: boolean
}

export class PostgresDatabaseSource extends DataSource {
	declare options: PostgresConnectionOptions
}

export const initializeDataSource = async (
	dataSource: PostgresDatabaseSource,
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

	logger.info(
		{
			dataSource: pick(['database', 'username', 'host', 'port', 'type'], dataSource.options)
		},
		`[Database] Datasource initialized`
	)

	// optionally run database migrations
	if (options?.runMigrations) {
		await runMigrations(dataSource)
	}

	return dataSource
}

export const closeAllDatabaseConnections = async (dataSource: DataSource): Promise<void> => {
	if (dataSource.isInitialized) {
		await dataSource.destroy()
	}
	logger.info(`[Database] Close all database connections (database=${dataSource.options.database})`)
}

export class PostgresConnectionPoolOptions {
	/**
	 * Number of milliseconds to wait before timing out when connecting a new client
	 * Set to 0 to disable timeout
	 * @default 0 (no timeout)
	 */
	connectionTimeoutMillis: number = 0

	/**
	 * Number of milliseconds a client must sit idle in the pool and not be checked out before it is disconnected from the backend and discarded
	 * Set to 0 to disable auto-disconnection of idle clients
	 * 	@default 10000 (10 seconds)
	 */
	idleTimeoutMillis?: number = 10_000

	/**
	 * Maximum number of clients the pool should contain
	 * @default 10
	 */
	max: number = 10

	/**
	 * Default behavior is the pool will keep clients open & connected to the backend
	 * until idleTimeoutMillis expire for each client and node will maintain a ref
	 * to the socket on the client, keeping the event loop alive until all clients are closed
	 * after being idle or the pool is manually shutdown with `pool.end()`.
	 * Setting `allowExitOnIdle: true` in the config will allow the node event loop to exit
	 * as soon as all clients in the pool are idle, even if their socket is still open
	 * to the postgres server.  This can be handy in scripts & tests
	 * where you don't want to wait for your clients to go idle before your process exits.
	 * @default false
	 */
	releaseConnections: boolean = true

	constructor(options: Partial<PostgresConnectionPoolOptions>) {
		Object.assign<PostgresConnectionPoolOptions, Partial<PostgresConnectionPoolOptions>>(this, options)
	}
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
	pool?: PostgresConnectionPoolOptions
}

export const createPostgresDataSource = (options: CreatePostgresDataSourceOptions) => {
	return new PostgresDatabaseSource({
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
