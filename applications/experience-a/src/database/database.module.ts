import { Database, getDataSource } from '#/database/database.service'
import { initializeDataSource, PostgresDatabaseSource, teardownDataSource } from '@mxvincent/typeorm'
import { FactoryProvider, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

const DataSourceProvider: FactoryProvider = {
	provide: PostgresDatabaseSource,
	useFactory: getDataSource
}

@Module({
	providers: [Database, DataSourceProvider],
	exports: [Database]
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
	async onModuleInit(): Promise<void> {
		await initializeDataSource(getDataSource(), { runMigrations: true })
	}

	async onModuleDestroy(): Promise<void> {
		await teardownDataSource(getDataSource())
	}
}
