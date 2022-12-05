import { DataSource } from 'typeorm'

export const closeAllDatabaseConnections = async (dataSource: DataSource): Promise<void> => {
	if (dataSource.isInitialized) {
		await dataSource.destroy()
	}
}
