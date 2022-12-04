import { DataSource, EntityManager } from 'typeorm'
import { initializeDataSource } from '../index'

export const getManager = async (dataSource: DataSource): Promise<EntityManager> => {
  if (!dataSource.isInitialized) {
    await initializeDataSource(dataSource)
  }
  return dataSource.manager
}
