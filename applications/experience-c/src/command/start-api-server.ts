import { server } from '#/api/server'
import { config } from '#/core/config'
import { getDataSource } from '#/database/data-source'
import { startStandaloneServer } from '@apollo/server/standalone'
import { logger } from '@mxvincent/telemetry'
import { initializeDataSource } from '@mxvincent/typeorm'

async function startApiServer() {
	const { url } = await startStandaloneServer(server, {
		listen: { port: config.server.port }
	})
	logger.info(`🚀 Server ready at: ${url}`)
}

initializeDataSource(getDataSource())
	.then(() => startApiServer())
	.catch((error) => logger.error({ error }))
