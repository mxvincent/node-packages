import { DataSource } from 'typeorm'

export const databaseShouldBeInitialized = (dataSource: DataSource): void => {
  if (!dataSource.isInitialized) {
    throw new Error('[database] data source should be initialized')
  }
}
