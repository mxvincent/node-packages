import { config } from '#/core/config'
import { relations, tables } from '#/database/schema'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

/**
 * Initialize postgres client
 */
export const postgresClient = postgres(config.database)

/**
 * Initialize drizzle instance
 */
export const database = drizzle(postgresClient, {
	logger: false,
	schema: {
		...tables,
		...relations
	}
})
