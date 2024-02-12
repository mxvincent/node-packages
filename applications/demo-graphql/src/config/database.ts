import { Type } from '@mxvincent/json-schema'

export const DatabaseConfigSchema = Type.Object({
	host: Type.String({ default: '127.0.0.1' }),
	port: Type.Integer({ default: 5432 }),
	database: Type.String({ default: 'account' }),
	schema: Type.Literal('public', { default: 'public' }),
	username: Type.String({ default: 'node-packages' }),
	password: Type.String({ default: 'node-packages' })
})

export const DatabaseConfigEnvironmentMapping = {
	host: 'DB_HOST',
	port: 'DB_PORT',
	database: 'DB_DATABASE',
	username: 'DB_USERNAME',
	password: 'DB_PASSWORD'
}
