import { EnvValue } from '@mxvincent/core'
import { Type } from '@mxvincent/json-schema'

export const schema = Type.Object({
	path: Type.String({
		description: 'Path used to expose graphql API',
		default: 'graphql'
	})
})

export const environment = {
	path: EnvValue.string('GRAPHQL_PATH')
}
