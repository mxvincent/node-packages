import { WorkloadConfig } from '#/components/config/workload-config'
import { WorkloadEnvironment } from '#/components/config/workload-environment'
import { CONFIG_FILE_NAME, CONFIG_FILE_PATH } from '#/components/shared'
import { WorkloadComponent } from '#/components/workload-component'
import { Job } from '#/components/workload/job'
import { WebService } from '#/components/workload/web-service'
import { ApplicationChart } from '#/helpers/chart'
import { node } from '#/helpers/command'
import { ApplicationContext, ComponentContext, Environment } from '#/helpers/context'
import { PostgresConfig } from '#/helpers/secrets'

const environment = (context: ComponentContext) => {
	return WorkloadEnvironment.register(context.parent, {
		CONFIG_FILE_PATH
	})
}

const config = (context: ComponentContext) => {
	const secrets = context.secrets.application
	return WorkloadConfig.register(context.parent, {
		[CONFIG_FILE_NAME]: {
			server: {
				host: '0.0.0.0',
				keepAliveTimeoutInMilliseconds: 61_000
			},
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

export class ExperienceB extends ApplicationChart {
	constructor(environment: Environment) {
		super(new ApplicationContext(environment, 'experience-b'))
	}

	components(context: ApplicationContext): WorkloadComponent[] {
		return [
			new WebService(context.extends('app-server'), {
				command: node('app-server.js')
			}),
			new Job(context.extends('debug'), {
				command: node('sandbox.js')
			}),
			new Job(context.extends('sync-database-schema'), {
				command: node('database/commands/migrate.js')
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
