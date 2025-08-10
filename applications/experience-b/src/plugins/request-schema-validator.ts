import { schemaCompiler, schemaCompilerWithCoercionEnabled } from '@mxvincent/json-schema'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import plugin from 'fastify-plugin'
import assert from 'node:assert'

export const fastifyRequestSchemaValidator: FastifyPluginAsync = plugin(
	async (app: FastifyInstance): Promise<void> => {
		app.setValidatorCompiler((request) => {
			assert.ok(request.httpPart, 'Request.httpPart is missing')
			// Request.httpPart can be 'body' | 'params' | 'querystring' | 'headers'
			switch (request.httpPart) {
				case 'headers':
				case 'params':
				case 'querystring':
					return schemaCompilerWithCoercionEnabled.compile(request.schema)
				default:
					return schemaCompiler.compile(request.schema)
			}
		})
	},
	{
		fastify: '5.x'
	}
)
