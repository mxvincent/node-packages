import { api } from '#/api/register'
import { config } from '#/core/config'
import { fastifyAuth } from '#/plugins/auth'
import { fastifyErrorHandler } from '#/plugins/error-handler'
import { fastifyRequestContext } from '#/plugins/request-context'
import { fastifyRequestLogger } from '#/plugins/request-logger'
import { fastifyRequestSchemaValidator } from '#/plugins/request-schema-validator'
import { fastifyResponseTime } from '#/plugins/response-time'
import fastifyHelmet from '@fastify/helmet'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { generateUUID } from '@mxvincent/core'
import { logger } from '@mxvincent/telemetry'
import Fastify from 'fastify'

const initializeAndStartAppServer = async () => {
	const app = Fastify({
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

	// Start http server
	await app.listen({
		host: config.server.host,
		port: config.server.port,
		listenTextResolver: (address) => `[app] server listening on ${address}`
	})
}

logger.info(`[app] initialization started`)
initializeAndStartAppServer().catch((error) => {
	logger.fatal(error)
	process.exit(1)
})
