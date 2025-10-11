import { EnvValue } from '@mxvincent/core'
import { Type } from '@mxvincent/json-schema'

export const schema = Type.Object({
	host: Type.String({ default: '127.0.0.1' }),
	port: Type.Integer({ default: 5432 }),
	schema: Type.String({ default: 'experience_c' }),
	database: Type.String({ default: 'application' }),
	username: Type.String({ default: 'mxvincent' }),
	password: Type.String({ default: 'mxvincent' })
})

export const environment = {
	host: EnvValue.string('DB_HOST'),
	port: EnvValue.number('DB_PORT'),
	database: EnvValue.string('DB_DATABASE'),
	schema: EnvValue.string('DB_SCHEMA'),
	username: EnvValue.string('DB_USERNAME'),
	password: EnvValue.string('DB_PASSWORD')
}
