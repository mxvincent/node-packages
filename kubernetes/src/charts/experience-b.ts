import { ComponentConfig } from '#/components/component-config'
import { WebServiceOptions } from '#/components/compute/web-service'
import { Environment } from '#/components/config/environment'
import { ConfigFiles } from '#/components/config/file'
import { ApplicationChart } from '#/helpers/chart'
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

export class ExperienceB extends ApplicationChart {
	get components() {
		return [
			new WebServiceOptions({
				name: 'app-server',
				command: ['node', '/app/applications/experience-b/dist/app-server.js'],
				replicas: 2,
				config: this.config,
				image: this.context.image
			})
		]
	}

	get config(): ComponentConfig {
		const CONFIG_FILE_PATH = `/app/config.json`
		const environment = new Environment(this.context, {
			CONFIG_FILE_PATH
		})
		const files = new ConfigFiles(this.context, {
			'config.json': configFileContent(this.context, this.secrets)
		})
		// TODO: handle per file mount paths
		return { environment, files, mountPath: CONFIG_FILE_PATH }
	}

	get secrets() {
		return new ExternalSecret(this.context.namespace)
	}
}