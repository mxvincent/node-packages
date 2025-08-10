import { WorkloadConfig } from '#/components/config/workload-config'
import { WorkloadEnvironment } from '#/components/config/workload-environment'
import { CONFIG_FILE_NAME, CONFIG_FILE_PATH } from '#/components/shared'
import { WorkloadComponent } from '#/components/workload-component'
import { WebService } from '#/components/workload/web-service'
import { ApplicationChart } from '#/helpers/chart'
import { node } from '#/helpers/command'
import { ApplicationContext, ComponentContext, Context, Environment, Provider } from '#/helpers/context'
import { PostgresConfig } from '#/helpers/secrets'
import { ExternalSecret } from '#/plugins/external-secret'

const environment: Provider<WorkloadEnvironment> = (context: Context) => {
	return WorkloadEnvironment.register(context, {
		CONFIG_FILE_PATH
	})
}

const config: Provider<WorkloadConfig> = (context: Context) => {
	const secrets = new ExternalSecret(`${context.environment}-${context.application}`)
	return WorkloadConfig.register(context, {
		[CONFIG_FILE_NAME]: {
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
		}
	})
}

export class ExperienceA extends ApplicationChart {
	constructor(environment: Environment) {
		super(new ApplicationContext(environment, 'experience-a'))
	}

	components(context: ApplicationContext): WorkloadComponent[] {
		return [
			new WebService(context.extends('app-server'), {
				command: node('app-server.js')
			})
		]
	}

	config(context: ComponentContext): WorkloadConfig {
		return config(context)
	}

	environment(context: ComponentContext) {
		return environment(context)
	}
}
