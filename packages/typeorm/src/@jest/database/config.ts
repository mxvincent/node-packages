import { DataSourceOptions } from 'typeorm'

// process.env.DB_TYPE = 'postgres'
process.env.DB_HOST = '127.0.0.1'
process.env.DB_PORT = '5432'
process.env.DB_DATABASE = 'mxvincent'
process.env.DB_USERNAME = 'mxvincent'
process.env.DB_PASSWORD = 'mxvincent'

export const config = {
	type: (process.env.DB_TYPE ?? 'sqlite') as DataSourceOptions['type'],
	database: process.env.DB_DATABASE,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD
}

export const dateType = config.type === 'postgres' ? 'timestamp with time zone' : 'text'
