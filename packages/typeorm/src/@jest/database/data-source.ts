import { EnvValue } from '@mxvincent/core'
import { logger } from '@mxvincent/telemetry'
import { PinoLoggerAdapter } from '../../adapters/logger'
import { PostgresDatabaseSource } from '../../helpers/data-source'
import { Author, DateContainer, Post } from './entities'

export const testDatasource = new PostgresDatabaseSource({
	type: 'postgres',
	schema: EnvValue.string('DB_SCHEMA') ?? 'typeorm',
	host: EnvValue.string('DB_HOST') ?? '127.0.0.1',
	port: EnvValue.number('DB_PORT') ?? 5432,
	database: EnvValue.string('DB_DATABASE') ?? 'test',
	username: EnvValue.string('DB_USERNAME') ?? 'mxvincent',
	password: EnvValue.string('DB_PASSWORD') ?? 'mxvincent',
	entities: [Author, Post, DateContainer],
	logger: new PinoLoggerAdapter(logger)
})
