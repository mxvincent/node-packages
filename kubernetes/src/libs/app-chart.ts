import { ComponentInterface } from '@libs/app-component'
import { AppConfig, ConfigFilesDescriptor, EnvironmentDescriptor } from '@libs/app-config'
import { AppContext } from '@libs/app-context'
import { CronJobFactory, CronJobOptions } from '@libs/components/cron-job'
import { DaemonFactory, DaemonOptions } from '@libs/components/daemon'
import { JobFactory, JobOptions } from '@libs/components/job'
import { WebServiceFactory, WebServiceOptions } from '@libs/components/web-service'
import { Namespace } from 'cdk8s-plus-27'
import { is } from 'ramda'

export interface ConfigFilesProviderInterface {
	/**
	 * Inject configuration files
	 */
	configFiles(context: AppContext): ConfigFilesDescriptor
}

const implementsConfigFilesProviderInterface = (value: unknown): value is ConfigFilesProviderInterface => {
	return is(Object, value) && 'configFiles' in value && typeof value.configFiles === 'function'
}

export interface EnvironmentProviderInterface {
	/**
	 * Inject environment variables
	 */
	environment(context: AppContext): EnvironmentDescriptor
}

const implementsEnvironmentProviderInterface = (value: unknown): value is EnvironmentProviderInterface => {
	return is(Object, value) && 'environment' in value && typeof value.environment === 'function'
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
		this.createNamespace()
		this.config = new AppConfig(context, {
			environment: implementsEnvironmentProviderInterface(this) ? this.environment : undefined,
			configFiles: implementsConfigFilesProviderInterface(this) ? this.configFiles : undefined
		})
		this.createApplicationResources()
	}

	/**
	 * Return the list of components to deploy
	 */
	abstract components(context: AppContext): Array<ComponentInterface>

	/**
	 * Create application namespace
	 */
	private createNamespace() {
		new Namespace(this.context.chart, this.context.namespace, {
			metadata: { name: this.context.namespace }
		})
	}

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
