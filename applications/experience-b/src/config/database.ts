import { EnvValue } from '@mxvincent/core'
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
	host: EnvValue.string('DB_HOST'),
	port: EnvValue.number('DB_PORT'),
	database: EnvValue.string('DB_DATABASE'),
	username: EnvValue.string('DB_USERNAME'),
	password: EnvValue.string('DB_PASSWORD')
}
