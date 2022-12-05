import { getLogger } from '@mxvincent/core'
import { setPrimaryKeyColumns } from '@mxvincent/typeorm'
import { DataSource } from 'typeorm'

export const initializeDataSource = async (dataSource: DataSource): Promise<void> => {
	const logger = getLogger()
	if (!dataSource.isInitialized) {
		logger.info('[database] initialize datasource')
		await dataSource.initialize()
		for (const entity of dataSource.entityMetadatas) {
			setPrimaryKeyColumns(
				entity.target,
				entity.primaryColumns.map((column) => column.propertyName)
			)
		}
		logger.info(`[database] datasource initialized`)
	} else {
		logger.debug(`[database] datasource already initialized`)
	}
}
