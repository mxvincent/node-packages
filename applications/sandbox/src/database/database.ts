import { postgresConnectionString } from '@/database/config'
import { schema, schemaRelations } from '@/database/schema'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

/**
 * Initialize postgres client
 */
export const postgresClient = postgres(postgresConnectionString)

/**
 * Initialize drizzle instance
 */
export const database = drizzle(postgresClient, {
	logger: true,
	schema: {
		...schema,
		...schemaRelations
	}
})
