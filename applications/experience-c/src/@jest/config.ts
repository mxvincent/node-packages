import { EnvValue } from '@mxvincent/core'
import { Static, Type, validate } from '@mxvincent/json-schema'
import { logger } from '@mxvincent/telemetry'
import { cpus } from 'node:os'

export const TestConfigSchema = Type.Object({
	workersCount: Type.Integer({ default: cpus().length - 1 }),
	workerId: Type.Integer({ default: 1 })
})

export let testConfig: Static<typeof TestConfigSchema>

try {
	testConfig = validate(
		TestConfigSchema,
		{
			workersCount: EnvValue.number('JEST_WORKERS_COUNT'),
			workerId: EnvValue.number('JEST_WORKER_ID')
		},
		{
			coerce: true
		}
	)
} catch (error) {
	logger.fatal(error)
	throw error
}
