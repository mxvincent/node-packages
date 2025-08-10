import { config } from '#/core/config.service'
import { PinoLoggerAdapter } from '#/core/logger.service'
import { AppModule } from '#/modules/app.module'
import { logger } from '@mxvincent/telemetry'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

async function appServer(): Promise<void> {
	logger.info(`[Config] environment: ${config.app.environment}`)
	logger.info(`[Config] time zone: ${config.app.timeZone}`)
	logger.info(`[Config] log level: ${config.app.logLevel}`)

	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
		autoFlushLogs: true,
		logger: new PinoLoggerAdapter()
	})
	app.useGlobalPipes(new ValidationPipe())

	await app.listen(config.server.port)

	const url = new URL(`http://${config.server.host}:${config.server.port}`)
	url.pathname = config.graphql.path
	logger.info(`🚀 Apollo server ready at ${url}`)
}

if (require.main === module) {
	appServer().catch((error) => {
		logger.fatal(error)
		process.exit(1)
	})
}
