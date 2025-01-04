import { ComponentConfig } from '@components/component-config'
import { WebServiceOptions } from '@components/compute/web-service'
import { Environment } from '@components/config/environment'
import { ConfigFiles } from '@components/config/file'
import { ApplicationChart } from '@helpers/chart'
import { Context } from '@helpers/context'
import { ExternalSecret } from '@plugins/external-secret'

const configFileContent = (context: Context, secrets: ExternalSecret) => ({
	logLevel: 'info',
	database: {
		type: 'postgres',
		host: 'postgres-15-postgresql.postgres-15.svc.cluster.local',
		port: 5432,
		database: secrets.ref('POSTGRES_DATABASE'),
		username: secrets.ref('POSTGRES_USERNAME'),
		password: secrets.ref('POSTGRES_PASSWORD')
	}
})

export class Experience extends ApplicationChart {
	get components() {
		return [
			new WebServiceOptions({
				name: 'app-server',
				command: ['node', '/app/applications/experience-a/dist/app-server.js'],
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
