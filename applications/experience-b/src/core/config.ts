import * as app from '@/config/app'
import * as database from '@/config/database'
import * as server from '@/config/server'
import {
	Environment,
	EnvironmentVariableMapping,
	getEnvironmentVariables,
	getPackageRootPath,
	readJsonFileSync
} from '@mxvincent/core'
import { JsonSchemaValidationError, Static, TSchema, Type, validate } from '@mxvincent/json-schema'
import { logger, serializers } from '@mxvincent/telemetry'
import { memoize } from 'lodash'
import process from 'node:process'
import { mergeDeepRight } from 'ramda'

const getConfigFilePath = (): string => {
	if (process.env.CONFIG_FILE_PATH) {
		return process.env.CONFIG_FILE_PATH
	}
	const packageRootPath = getPackageRootPath(__dirname)
	const environment = process.env.NODE_ENV
	if (!environment || environment === Environment.TEST) {
		return `${packageRootPath}/config.example.json`
	}
	return `${packageRootPath}/config.json`
}

const loadConfig = memoize(<T extends TSchema>(schema: T, environment?: EnvironmentVariableMapping): Static<T> => {
	try {
		const configFromEnv = environment ? getEnvironmentVariables(environment) : {}
		const configFromFile = readJsonFileSync(getConfigFilePath())
		return validate(schema, mergeDeepRight(configFromFile, configFromEnv), {
			coerce: true
		})
	} catch (error) {
		if (error instanceof JsonSchemaValidationError) {
			logger.fatal(
				{
					validation: error.errors,
					error: serializers.error(error)
				},
				error.message
			)
		}
		throw error
	}
})

export const config = loadConfig(
	Type.Object({
		app: app.schema,
		database: database.schema,
		server: server.schema
	}),
	{
		app: app.environment,
		database: database.environment,
		server: server.environment
	}
)