import { PinoLoggerAdapter } from '../../adapters/PinoLoggerAdapter'
import { PostgresDatabaseSource } from '../../helpers/connections'
import { Author } from './entities/Author'
import { DateContainer } from './entities/DateContainer'
import { Post } from './entities/Post'

export const TESTING_DATABASE_NAME = 'typeorm'

export const testDatasource = new PostgresDatabaseSource({
	type: 'postgres',
	host: process.env.DB_HOST ?? '127.0.0.1',
	port: Number(process.env.DB_PORT ?? '5432'),
	database: TESTING_DATABASE_NAME,
	username: process.env.DB_USERNAME ?? 'node-packages',
	password: process.env.DB_PASSWORD ?? 'node-packages',
	entities: [Author, Post, DateContainer],
	logger: new PinoLoggerAdapter()
})
