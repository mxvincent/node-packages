import 'dotenv/config'
import { config } from '#/core/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './src/database/schemas',
	out: './src/database/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		...config.database
	}
})
