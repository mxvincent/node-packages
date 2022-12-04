import { getLogger } from '@mxvincent/core'
import { DataSource, DataSourceOptions } from 'typeorm'
import { getPostgresConfig } from '../config/postgres'

export * from './functions'
export { factories } from './factories'

const getDataSourceOptions = (): DataSourceOptions => {
	const options: DataSourceOptions = {
		name: 'demo',
		type: 'postgres',
		schema: 'public',
		synchronize: false,
		dropSchema: false,
		migrationsRun: true,
		logging: ['error', 'warn'],
		entities: ['dist/database/entities/*.js'],
		migrations: ['dist/database/migrations/*.js'],
		subscribers: ['dist/database/subscribers/*.js'],
		migrationsTableName: '@migration',
		metadataTableName: '@metadata',
		...getPostgresConfig()
	}
	if (process.env['NODE_ENV'] !== 'production') {
		Object.assign(options, {
			...options,
			entities: ['src/database/entities/*.ts'],
			migrations: ['src/database/migrations/*.ts'],
			subscribers: ['src/database/subscribers/*.ts']
		})
	}
	return options
}

export const database = new DataSource(getDataSourceOptions())
getLogger().info(`[database] demo database configured`)
