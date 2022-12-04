import { DataSource } from 'typeorm'
import { databaseShouldBeConnected, databaseShouldBeInitialized } from '../index'

export const closeAllDatabaseConnections = async (dataSource: DataSource): Promise<void> => {
  databaseShouldBeInitialized(dataSource)
  databaseShouldBeConnected(dataSource)
  await dataSource.destroy()
}
