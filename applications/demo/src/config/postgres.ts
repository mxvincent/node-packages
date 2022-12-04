import { getConfigOrFail } from '@mxvincent/config-json-schema'
import { PostgresConfig } from '@mxvincent/typeorm'
import { Type } from '@sinclair/typebox'
import { getConfigFilePath } from '../functions/getConfigFilePath'

let config: PostgresConfig

const PostgresConfigSchema = Type.Object({
	host: Type.String(),
	port: Type.Number(),
	database: Type.String(),
	username: Type.String(),
	password: Type.String()
})

export const getPostgresConfig = (reloadConfigFile = false): PostgresConfig => {
	if (reloadConfigFile || !config) {
		config = getConfigOrFail({
			env: {
				host: 'POSTGRES_HOST',
				port: 'POSTGRES_PORT',
				database: 'POSTGRES_DATABASE',
				username: 'POSTGRES_USERNAME',
				password: 'POSTGRES_PASSWORD'
			},
			file: { path: getConfigFilePath(), jsonPath: 'postgres' },
			schema: PostgresConfigSchema
		})
	}
	return config
}
