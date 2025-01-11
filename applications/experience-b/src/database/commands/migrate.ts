import { database, postgresClient } from '#/database/client'
import { logger, serializers } from '@mxvincent/telemetry'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import * as path from 'node:path'

migrate(database, { migrationsFolder: path.resolve('src/database/migrations') })
	.then(() => logger.info('database migrated'))
	.catch((error) => logger.fatal({ error: serializers.error(error) }))
	.finally(postgresClient.end)
