import { getConfigOrFail } from '@mxvincent/config-json-schema'
import { Static, Type } from '@sinclair/typebox'
import { getConfigFilePath } from '../functions/getConfigFilePath'

const AppConfigSchema = Type.Object(
	{
		server: Type.Object(
			{
				host: Type.String({ default: '0.0.0.0' }),
				port: Type.Number({ default: 4000 })
			},
			{
				description: 'Application server config.',
				default: {}
			}
		)
	},
	{
		$id: 'AppConfig',
		additionalProperties: false,
		description: 'Application configuration.'
	}
)

export type AppConfig = Static<typeof AppConfigSchema>

let config: AppConfig

export const getAppConfig = (reloadConfigFile = false): AppConfig => {
	if (reloadConfigFile || !config) {
		config = getConfigOrFail({
			env: {
				server: {
					host: 'APP_SERVER_HOST',
					port: 'APP_SERVER_PORT'
				}
			},
			file: { path: getConfigFilePath(), jsonPath: 'app' },
			schema: AppConfigSchema
		})
	}
	return config
}
