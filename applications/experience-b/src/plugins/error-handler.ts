import { getHttpStatusCode } from '@mxvincent/core'
import { FastifyError, FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import plugin from 'fastify-plugin'

export const fastifyErrorHandler: FastifyPluginAsync = plugin(
	async (app: FastifyInstance): Promise<void> => {
		app.setErrorHandler(async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
			reply.statusCode = getHttpStatusCode(error)
			return reply.send(error)
		})
	},
	{
		fastify: '5.x'
	}
)
