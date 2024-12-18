import { Env } from '@mxvincent/core'
import { defineConfig } from 'drizzle-kit'

/**
 * Get postgres connection string from environment
 */
export const postgresConnectionString = Env.required('POSTGRES_URL')

export default defineConfig({
	schema: './database/schemas',
	out: './database/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: postgresConnectionString
	}
})
