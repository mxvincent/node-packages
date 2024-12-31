import 'dotenv/config'
import { Env } from '@mxvincent/core'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './src/database/schemas',
	out: './src/database/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: Env.required('DATABASE_URL')
	}
})
