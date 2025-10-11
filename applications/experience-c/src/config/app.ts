import { Environment, EnvValue, TimeZone } from '@mxvincent/core'
import { Type } from '@mxvincent/json-schema'
import { LogLevel } from '@mxvincent/telemetry'

export const schema = Type.Object({
	logLevel: Type.Enum(LogLevel, { default: 'info' }),
	timeZone: Type.Enum(TimeZone, { default: TimeZone.UTC }),
	environment: Type.Enum(Environment, { default: Environment.DEVELOPMENT })
})

export const environment = {
	logLevel: EnvValue.string('LOG_LEVEL'),
	timeZone: EnvValue.string('TIME_ZONE'),
	environment: EnvValue.string('NODE_ENV')
}
