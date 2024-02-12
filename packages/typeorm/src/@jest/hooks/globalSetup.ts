import { LogLevel, setLogLevel } from '@mxvincent/logger'
import 'dotenv/config'
import * as process from 'process'
import { DataSource, DataSourceOptions } from 'typeorm'
import { closeAllDatabaseConnections, initializeDataSource } from '../../helpers/connections'
import { testDatasource, TESTING_DATABASE_NAME } from '../database/dataSource'

if (process.env.LOG_LEVEL) {
	setLogLevel(process.env.LOG_LEVEL as LogLevel)
}

const mainDataSourceOptions = {
	type: 'postgres',
	host: process.env.DB_HOST ?? '127.0.0.1',
	port: Number(process.env.DB_PORT ?? '5432'),
	database: process.env.DB_DATABASE ?? 'node-packages',
	username: process.env.DB_USERNAME ?? 'node-packages',
	password: process.env.DB_PASSWORD ?? 'node-packages'
} satisfies DataSourceOptions

export default async function globalSetup() {
	// Drop (if exists) and create testing database
	const mainDataSource = new DataSource(mainDataSourceOptions)
	await initializeDataSource(mainDataSource, { runMigrations: false })
	await mainDataSource.query(`DROP DATABASE IF EXISTS "${TESTING_DATABASE_NAME}";`)
	await mainDataSource.query(
		`CREATE DATABASE "${TESTING_DATABASE_NAME}" WITH OWNER "${mainDataSourceOptions.username}";`
	)
	await closeAllDatabaseConnections(mainDataSource)

	// Sync testing database
	await initializeDataSource(testDatasource, { runMigrations: false })
	await testDatasource.synchronize()
	await closeAllDatabaseConnections(testDatasource)
}
