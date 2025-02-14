import { Actor } from '#/plugins/auth'
import { logger } from '@mxvincent/telemetry'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import plugin from 'fastify-plugin'
import { AsyncLocalStorage } from 'node:async_hooks'

export const requestContext = new AsyncLocalStorage<{
	actor: Actor | null
	request: {
		id: string
		method: string
		path: string
		params: unknown
		headers: Record<string, unknown>
	}
	logger: typeof logger
}>()

export const fastifyRequestContext: FastifyPluginAsync = plugin(
	async (app: FastifyInstance): Promise<void> => {
		app.addHook('onRequest', (request, response, done) => {
			const context = {
				logger: logger.child({
					request: request.id
				}),
				actor: request.actor,
				request: {
					id: request.id,
					method: request.method,
					path: request.routeOptions.url as string,
					params: request.params,
					headers: request.headers
				}
			}
			void response.header('x-request-id', request.id)
			requestContext.run(context, done)
		})
	},
	{
		fastify: '5.x'
	}
)
