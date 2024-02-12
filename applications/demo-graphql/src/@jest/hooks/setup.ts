import { config } from '@app/config'
import { createDataSource } from '@database/database.service'
import { testConfig } from '@jest/config'
import { getWorkerDatabaseName, templateDatabaseName } from '@jest/database'
import { logger } from '@mxvincent/logger'
import {
	closeAllDatabaseConnections,
	createPostgresDataSource,
	initializeDataSource,
	runMigrations
} from '@mxvincent/typeorm'

const templateInitQuery = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS
$$
DECLARE
    statements CURSOR FOR
        SELECT tablename
        FROM pg_tables
        WHERE tableowner = username
          AND schemaname = 'public';
BEGIN
    FOR stmt IN statements
        LOOP
            EXECUTE 'TRUNCATE TABLE ' || QUOTE_IDENT(stmt.tablename) || ' CASCADE;';
        END LOOP;
END;
$$ LANGUAGE plpgsql;
`

const createDatabases = async () => {
	// Initialize main database connection
	const mainDataSource = createPostgresDataSource(config.database)
	await initializeDataSource(mainDataSource, { runMigrations: false })

	// Create template database
	try {
		await mainDataSource.query(`ALTER DATABASE "${templateDatabaseName}" WITH IS_TEMPLATE false;`)
	} catch (error) {
		logger.error(error as never)
	}
	await mainDataSource.query(`DROP DATABASE IF EXISTS "${templateDatabaseName}";`)
	await mainDataSource.query(
		`CREATE DATABASE "${templateDatabaseName}" WITH OWNER "${config.database.username}" IS_TEMPLATE true;`
	)

	// Initialize template database
	const templateDataSource = createDataSource({
		database: templateDatabaseName,
		entities: [],
		subscribers: []
	})
	await initializeDataSource(templateDataSource, { runMigrations: false })
	await templateDataSource.query(templateInitQuery)
	await runMigrations(templateDataSource)
	await closeAllDatabaseConnections(templateDataSource)

	// Create databases for jest workers
	for (let i = 1; i <= testConfig.workersCount; i++) {
		const workerDatabaseName = getWorkerDatabaseName(i)
		await mainDataSource.query(`DROP DATABASE IF EXISTS "${workerDatabaseName}";`)
		await mainDataSource.query(`CREATE DATABASE "${workerDatabaseName}" TEMPLATE "${templateDatabaseName}";`)
		logger.info(`[JestSetup] Create database ${workerDatabaseName} from template ${templateDatabaseName}`)
	}

	// Close main database connection
	await closeAllDatabaseConnections(mainDataSource)
}

export default async function () {
	try {
		await createDatabases()
	} catch (error) {
		logger.error(error)
	}
	logger.info('[JestSetup] completed')
}
