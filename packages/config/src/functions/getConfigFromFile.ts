import { readJsonFileSync } from '@mxvincent/core'

export type ConfigFileOptions = { path: string; jsonPath?: string }

export const getConfigFromFile = (options: ConfigFileOptions): Record<string, unknown> => {
	const configJson = readJsonFileSync(options.path)
	if (!options.jsonPath) {
		return configJson
	}
	return options.jsonPath.split('.').reduce((container, key) => {
		if (typeof container === 'object') return container[key]
	}, configJson)
}
