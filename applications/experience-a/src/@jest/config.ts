import { getEnvironmentVariables } from '@mxvincent/core'
import { Static, Type, validate } from '@mxvincent/json-schema'
import { logger } from '@mxvincent/telemetry'
import { cpus } from 'node:os'

export const TestConfigSchema = Type.Object({
	workersCount: Type.Integer({ default: cpus().length - 1 }),
	workerId: Type.Integer({ default: 1 })
})

export const TestConfigEnvironmentMapping = {
	workersCount: 'JEST_WORKERS_COUNT',
	workerId: 'JEST_WORKER_ID'
}

export let testConfig: Static<typeof TestConfigSchema>

try {
	testConfig = validate(TestConfigSchema, getEnvironmentVariables(TestConfigEnvironmentMapping), {
		coerce: true
	})
} catch (error) {
	logger.fatal(error)
	throw error
}
