import { AppChart } from '@libs/app-chart'
import { ConfigFilesDescriptor, createConfigFile } from '@libs/app-config'
import { AppContext, ContextAdapter } from '@libs/app-context'
import { WebServiceOptions } from '@libs/components/web-service'
import { IngressConfig } from '@libs/k8s'

const configFiles: ContextAdapter<ConfigFilesDescriptor> = (context) => {
	return createConfigFile((secrets) => ({
		logLevel: 'info',
		database: {
			type: 'postgres',
			host: 'postgres-15-postgresql.postgres-15.svc.cluster.local',
			port: 5432,
			database: `${context.environment}-${context.application}`,
			username: secrets.inject(context.applicationSecret('DATABASE_USERNAME')),
			password: secrets.inject(context.applicationSecret('DATABASE_PASSWORD'))
		}
	}))
}

const getIngressConfig: ContextAdapter<IngressConfig> = ({ application, environment }: AppContext) => {
	return {
		host: environment === 'production' ? `${application}.row.ovh` : `${environment}.${application}.row.ovh`
	}
}

export class DemoGraphql extends AppChart {
	components(context: AppContext) {
		return [
			new WebServiceOptions('app-server', {
				command: ['node', '/app/applications/demo-graphql/dist/app-server.js'],
				ingress: getIngressConfig(context)
			})
		]
	}

	configFiles(context: AppContext): ConfigFilesDescriptor {
		return configFiles(context)
	}
}
