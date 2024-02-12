import { ComponentInterface } from '@libs/app-component'
import { AppConfig, ConfigFilesDescriptor, EnvironmentDescriptor } from '@libs/app-config'
import { AppContext } from '@libs/app-context'
import { CronJobFactory, CronJobOptions } from '@libs/components/cron-job'
import { DaemonFactory, DaemonOptions } from '@libs/components/daemon'
import { JobFactory, JobOptions } from '@libs/components/job'
import { WebServiceFactory, WebServiceOptions } from '@libs/components/web-service'

export interface AppChart {
	/**
	 * Inject configuration files
	 */
	configFiles?(context: AppContext): ConfigFilesDescriptor

	/**
	 * Inject environment variables
	 */
	environment?(context: AppContext): EnvironmentDescriptor
}

/**
 * Service chart is the top level abstraction for deploying a complete application to Kubernetes.
 */
export abstract class AppChart {
	/**
	 * Application context
	 */
	readonly context: AppContext

	/**
	 * Application config
	 */
	readonly config: AppConfig

	/**
	 * Create application manifest
	 */
	constructor(context: AppContext) {
		this.context = context
		this.config = new AppConfig(context, {
			configFiles: this.configFiles,
			environment: this.environment
		})
		this.createApplicationResources()
	}

	/**
	 * Return the list of components to deploy
	 */
	abstract components(context: AppContext): Array<ComponentInterface>

	/**
	 * Build all application resources
	 */
	private createApplicationResources() {
		const { context, config } = this
		for (const component of this.components(context)) {
			if (component instanceof CronJobOptions) {
				new CronJobFactory(context.chart, { context, component, config })
			}
			if (component instanceof DaemonOptions) {
				new DaemonFactory(context.chart, { context, component, config })
			}
			if (component instanceof JobOptions) {
				new JobFactory(context.chart, { context, component, config })
			}
			if (component instanceof WebServiceOptions) {
				new WebServiceFactory(context.chart, { context, component, config })
			}
		}
	}
}
