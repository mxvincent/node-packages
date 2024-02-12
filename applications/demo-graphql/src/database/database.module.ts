import { DatabaseContext, getDataSource } from '@database/database.service'
import { closeAllDatabaseConnections, DataSource, initializeDataSource } from '@mxvincent/typeorm'
import { FactoryProvider, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

const DataSourceProvider: FactoryProvider = {
	provide: DataSource,
	useFactory: getDataSource
}

@Module({
	providers: [DatabaseContext, DataSourceProvider],
	exports: [DatabaseContext]
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
	async onModuleInit(): Promise<void> {
		await initializeDataSource(getDataSource(), { runMigrations: true })
	}

	async onModuleDestroy(): Promise<void> {
		await closeAllDatabaseConnections(getDataSource())
	}
}
