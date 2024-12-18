import { AppConfig, AppConfigEnvironmentMapping, AppConfigSchema } from '@app/config'
import { getEnvironmentVariables, getPackageRootPath, readJsonFileSync } from '@mxvincent/core'
import { JsonSchemaValidationError, validate } from '@mxvincent/json-schema'
import { logger, serializers } from '@mxvincent/telemetry'
import process from 'node:process'
import { mergeDeepRight } from 'ramda'

export const getConfigFilePath = (): string => {
	if (process.env.CONFIG_FILE_PATH) {
		return process.env.CONFIG_FILE_PATH
	}
	const packageRootPath = getPackageRootPath(__dirname)
	const environment = process.env.NODE_ENV
	if (!environment || environment === 'test') {
		return `${packageRootPath}/config.example.json`
	}
	return `${packageRootPath}/config.json`
}

let config: AppConfig | undefined

export const loadConfig = (): AppConfig => {
	if (config) {
		return config
	}
	try {
		const configFromEnv = getEnvironmentVariables(AppConfigEnvironmentMapping)
		const configFromFile = readJsonFileSync(getConfigFilePath())
		return validate(AppConfigSchema, mergeDeepRight(configFromFile, configFromEnv), {
			coerce: true
		})
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)
		if (error instanceof JsonSchemaValidationError) {
			logger.fatal({ error: serializers.error(error) }, error.message)
		}
		throw error
	}
}
