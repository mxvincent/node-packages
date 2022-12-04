import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from './config'
import { Author } from './entities/Author'
import { DateContainer } from './entities/DateContainer'
import { Post } from './entities/Post'
import { User } from './entities/User'
import { createAuthors, createDateContainers, createUsers } from './factories'

export const createDataSource = (): DataSource => {
	const defaultOptions: Partial<DataSourceOptions> = {
		dropSchema: true,
		synchronize: true,
		logging: false,
		entities: [Author, Post, User, DateContainer]
	}
	if (config.type === 'postgres') {
		return new DataSource({
			...defaultOptions,
			...config
		} as DataSourceOptions)
	}
	return new DataSource({
		...defaultOptions,
		type: 'sqlite',
		database: ':memory:'
	} as DataSourceOptions)
}

export { User, Post, DateContainer }

export const database = createDataSource()

export const factories = { createUsers, createAuthors, createDateContainers }
