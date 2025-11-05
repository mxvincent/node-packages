import {api} from '#/api/api'
import {config} from '#/core/config'
import fastifyHelmet from '@fastify/helmet'
import {TypeBoxTypeProvider} from '@fastify/type-provider-typebox'
import {generateUUID} from '@mxvincent/core'
import {logger} from '@mxvincent/telemetry'
import {fastifyAuth, fastifyErrorHandler, fastifyRequestContext, fastifyRequestLogger, fastifyRequestSchemaValidator, fastifyResponseTime} from '@package/incubator'
import fastify from 'fastify'

export async function initializeAppServer() {
	const app = fastify({
		loggerInstance: logger,
		disableRequestLogging: true,
		keepAliveTimeout: config.server.keepAliveTimeoutInMilliseconds,
		genReqId: () => generateUUID(7)
	}).withTypeProvider<TypeBoxTypeProvider>()

	// Register plugins
	await app.register(fastifyHelmet)
	await app.register(fastifyAuth)
	await app.register(fastifyRequestContext)
	await app.register(fastifyRequestLogger)
	await app.register(fastifyRequestSchemaValidator)
	await app.register(fastifyResponseTime)
	await app.register(fastifyErrorHandler)

	// Register API endpoints
	await app.register(api)

	return app
}
