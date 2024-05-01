import { ComponentConfig } from '@components/component-config'
import { WebServiceOptions } from '@components/compute/web-service'
import { Environment } from '@components/config/environment'
import { ConfigFiles } from '@components/config/file'
import { ApplicationChart } from '@libs/application-chart'
import { Context, Provider } from '@libs/context'
import { ExternalSecret } from '@libs/extentions/external-secret'
import { IngressConfig } from '@libs/extentions/ingress'

const ingressConfig: Provider<IngressConfig> = ({ application, environment }) => {
	return {
		host: environment === 'production' ? `${application}.row.ovh` : `${environment}.${application}.row.ovh`
	}
}

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

export class DemoGraphql extends ApplicationChart {
	get components() {
		return [
			new WebServiceOptions({
				name: 'app-server',
				command: ['node', '/app/applications/demo-graphql/dist/app-server.js'],
				ingress: ingressConfig(this.context),
				replicas: 2,
				config: this.config,
				image: this.context.image
			})
		]
	}

	get config(): ComponentConfig {
		const environment = new Environment(this.context, {
			CONFIG_FILE_PATH: `/app/config.json`
		})
		const files = new ConfigFiles(this.context, {
			'config.json': configFileContent(this.context, this.secrets)
		})
		return { environment, files, mountPath: '/app' }
	}

	get secrets() {
		return new ExternalSecret(this.context.namespace)
	}
}
