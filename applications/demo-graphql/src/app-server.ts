import { PinoLoggerAdapter } from '@app/core/logger.service'
import { logger } from '@mxvincent/logger'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module'
import { config } from './config'

async function appServer(): Promise<void> {
	logger.info(`[Config] time zone: ${config.timeZone}`)
	logger.info(`[Config] log level: ${config.logLevel}`)

	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
		autoFlushLogs: true,
		logger: new PinoLoggerAdapter()
	})
	app.useGlobalPipes(new ValidationPipe())
	app.useLogger(app.get(Logger))

	await app.listen(config.api.server.port)

	const url = new URL(`http://${config.api.server.host}:${config.api.server.port}`)
	url.pathname = config.api.graphqlPath
	logger.info(`🚀 Apollo server ready at ${url}`)
}

if (require.main === module) {
	appServer().catch((error) => {
		logger.fatal(error)
		process.exit(1)
	})
}
