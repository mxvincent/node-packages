import { config } from '#/core/config'

import { createPostgresDataSource, CreatePostgresDataSourceOptions, PostgresDatabaseSource } from '@mxvincent/typeorm'

export const createDataSource = (
	configOverrides?: Partial<CreatePostgresDataSourceOptions>
): PostgresDatabaseSource => {
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
