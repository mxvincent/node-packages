import { ConfigError, EnvironmentVariableMapping, getConfigFromEnvironment, getConfigFromFile } from '@mxvincent/config'
import { validateOrFail } from '@mxvincent/json-schema'
import { TSchema } from '@sinclair/typebox'
import { mergeDeepRight } from 'ramda'

export type GetConfigOptions<T> = {
	schema: TSchema
	file?: { path: string; jsonPath: string }
	env?: EnvironmentVariableMapping
	defaultValues?: Partial<T>
}

export const getConfigOrFail = <T>(options: GetConfigOptions<T>): T => {
	if (!options.file && !options.env) {
		throw new ConfigError('options should contain one or more target (env,file)')
	}
	const sources: object[] = [options.defaultValues ?? {}]
	const validate = validateOrFail<T>(options.schema)
	if (options.file) {
		sources.push(getConfigFromFile(options.file))
	}
	if (options.env) {
		sources.push(getConfigFromEnvironment(options.env))
	}
	return validate(sources.reduce(mergeDeepRight))
}
