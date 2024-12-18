import { Type } from '@mxvincent/json-schema'

export const ApiConfigSchema = Type.Object({
	server: Type.Object({
		host: Type.String({ default: '127.0.0.1' }),
		port: Type.Integer({ default: 4000 })
	}),
	graphqlPath: Type.String({ default: 'graphql' })
})

export const ApiConfigEnvironmentMapping = {
	server: {
		host: 'API_SERVER_HOST',
		port: 'API_SERVER_PORT'
	},
	graphqlPath: 'API_GRAPHQL_PATH'
}
