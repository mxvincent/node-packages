import { Type, validate } from '@mxvincent/json-schema'
import { getEnvironmentVariables } from '@mxvincent/utils'
import { cpus } from 'node:os'

export const TestConfigSchema = Type.Object({
	workersCount: Type.Integer({ default: cpus().length - 1 }),
	workerId: Type.Integer({ default: 1 })
})

export const TestConfigEnvironmentMapping = {
	workersCount: 'JEST_WORKERS_COUNT',
	workerId: 'JEST_WORKER_ID'
}

export const testConfig = validate(TestConfigSchema, getEnvironmentVariables(TestConfigEnvironmentMapping))
