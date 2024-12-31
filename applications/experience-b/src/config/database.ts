import { Type } from '@mxvincent/json-schema'

export const schema = Type.Object({
	host: Type.String({ default: '127.0.0.1' }),
	port: Type.Integer({ default: 5432 }),
	schema: Type.Literal('public', { default: 'public' }),
	database: Type.String({ default: 'experience-b' }),
	username: Type.String({ default: 'node-packages' }),
	password: Type.String({ default: 'node-packages' })
})

export const environment = {
	host: 'DB_HOST',
	port: 'DB_PORT',
	database: 'DB_DATABASE',
	username: 'DB_USERNAME',
	password: 'DB_PASSWORD'
}
