import { ComponentConfig, CONFIG_FILE_PATH } from '#/components/component-config'
import { WebServiceOptions } from '#/components/compute/web-service'
import { Environment } from '#/components/config/environment'
import { ConfigFiles } from '#/components/config/file'
import { ApplicationChart } from '#/helpers/chart'
import { node } from '#/helpers/command'
import { Context } from '#/helpers/context'
import { PostgresConfig } from '#/helpers/secrets'
import { ExternalSecret } from '#/plugins/external-secret'

const configFileContent = (context: Context, secrets: ExternalSecret) => ({
	app: {
		logLevel: 'info',
		timeZone: 'UTC'
	},
	database: {
		type: 'postgres',
		host: secrets.ref(PostgresConfig.HOST),
		port: secrets.ref(PostgresConfig.PORT),
		database: secrets.ref(PostgresConfig.DATABASE),
		username: secrets.ref(PostgresConfig.USERNAME),
		password: secrets.ref(PostgresConfig.PASSWORD)
	}
})

export class ExperienceA extends ApplicationChart {
	get components() {
		return {
			'app-server': new WebServiceOptions({
				command: node('app-server.js'),
				replicas: 2,
				config: this.config,
				image: this.context.image
			})
		}
	}

	get config(): ComponentConfig {
		const environment = new Environment(this.context, { CONFIG_FILE_PATH })
		const files = new ConfigFiles(this.context, {
			'config.json': configFileContent(this.context, this.secrets)
		})
		return { environment, files }
	}

	get secrets() {
		return new ExternalSecret(`${this.context.environment}-${this.context.application}`)
	}
}
