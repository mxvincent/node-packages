import { AppConfig, AppConfigEnvironmentMapping, AppConfigSchema } from '@app/config'
import { JsonSchemaValidationError, validate } from '@mxvincent/json-schema'
import { logger, serializers } from '@mxvincent/logger/dist'
import { getEnvironmentVariables, getPackageRootPath, readJsonFileSync } from '@mxvincent/utils'
import process from 'node:process'
import { mergeDeepRight } from 'ramda'

export const getConfigFilePath = (): string => {
	if (process.env.CONFIG_FILE_PATH) {
		return process.env.CONFIG_FILE_PATH
	}
	const packageRootPath = getPackageRootPath(__dirname)
	const environment = process.env.NODE_ENV
	const defaultPath = `${packageRootPath}/config.json`
	if (environment && environment === 'test') {
		return `${packageRootPath}/config.example.json`
	}
	if (environment && environment !== 'production') {
		return `${packageRootPath}/config.${process.env.NODE_ENV}.json`
	}
	return defaultPath
}

let config: AppConfig
export const loadConfig = (): AppConfig => {
	if (config) {
		return config
	}
	try {
		const configFromEnv = getEnvironmentVariables(AppConfigEnvironmentMapping)
		const configFromFile = readJsonFileSync(getConfigFilePath())
		return validate(AppConfigSchema, mergeDeepRight(configFromFile, configFromEnv))
	} catch (error) {
		if (error instanceof JsonSchemaValidationError) {
			logger.fatal({ error: serializers.error(error) }, error.message)
		}
		throw error
	}
}
