import { config } from '@/config'
import { fastifyAuth } from '@/plugins/auth'
import { fastifyErrorHandler } from '@/plugins/error-handler'
import { fastifyRequestLogger } from '@/plugins/request-logger'
import { fastifyResponseTime } from '@/plugins/response-time'
import { api } from '@api/register'
import fastifyHelmet from '@fastify/helmet'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { generateUUID } from '@mxvincent/core'
import { schemaCompiler, schemaCompilerWithCoercionEnabled } from '@mxvincent/json-schema'
import { logger } from '@mxvincent/telemetry'
import Fastify from 'fastify'
import assert from 'node:assert'
import { fastifyRequestContext } from './plugins/request-context'

const initializeAndStartAppServer = async () => {
	const app = Fastify({
		loggerInstance: logger,
		disableRequestLogging: true,
		keepAliveTimeout: config.server.keepAliveTimeoutInMilliseconds,
		genReqId: () => generateUUID(7)
	}).withTypeProvider<TypeBoxTypeProvider>()

	app.setValidatorCompiler((request) => {
		assert.ok(request.httpPart, 'Request.httpPart is missing')
		switch (request.httpPart) {
			case 'querystring':
				return schemaCompilerWithCoercionEnabled.compile(request.schema)
			default:
				return schemaCompiler.compile(request.schema)
		}
	})

	await app.register(fastifyHelmet)
	await app.register(fastifyAuth)
	await app.register(fastifyRequestContext)
	await app.register(fastifyRequestLogger)
	await app.register(fastifyResponseTime)
	await app.register(fastifyErrorHandler)
	// await app.register(fastifyQueryStringParser)

	await app.register(api)
	console.log(config.server)
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
