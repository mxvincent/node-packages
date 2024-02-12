import { ApiConfigEnvironmentMapping, ApiConfigSchema } from '@app/config/api'
import { loadConfig } from '@app/core/config.service'
import { Environment } from '@app/types/Environment'
import { TimeZone } from '@app/types/TimeZone'
import { Static, Type } from '@mxvincent/json-schema'
import { LogLevel } from '@mxvincent/logger'
import 'dotenv/config'
import { DatabaseConfigEnvironmentMapping, DatabaseConfigSchema } from './database'

export const AppConfigSchema = Type.Object({
	logLevel: Type.Enum(LogLevel, { default: 'info' }),
	timeZone: Type.Enum(TimeZone, { default: TimeZone.UTC }),
	environment: Type.Enum(Environment, { default: Environment.development }),
	database: DatabaseConfigSchema,
	api: ApiConfigSchema
})

export const AppConfigEnvironmentMapping = {
	logLevel: 'LOG_LEVEL',
	timeZone: 'TIME_ZONE',
	database: DatabaseConfigEnvironmentMapping,
	api: ApiConfigEnvironmentMapping
}

export type AppConfig = Static<typeof AppConfigSchema>

export const config = loadConfig()
