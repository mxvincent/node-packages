import { ComponentOptions } from '#/components/component-options'
import { CronJobFactory, CronJobOptions } from '#/components/compute/cron-job'
import { DaemonFactory, DaemonOptions } from '#/components/compute/daemon'
import { JobFactory, JobOptions } from '#/components/compute/job'
import { WebServiceFactory, WebServiceOptions } from '#/components/compute/web-service'
import { Context } from '#/helpers/context'

/**
 * Application chart is the top level abstraction for deploying a complete application to Kubernetes.
 */
export abstract class ApplicationChart {
	/**
	 * Application context
	 */
	readonly context: Context

	/**
	 * Create application manifests
	 */
	constructor(context: Context) {
		this.context = context
		for (const [component, options] of Object.entries(this.components)) {
			this.registerComponent(context.extends({ component }), options)
		}
	}

	/**
	 * Returns options in order to instantiate one or more components
	 */
	protected get components(): Record<string, ComponentOptions> {
		return {}
	}

	/**
	 * Attempts to instantiate a component linked to the type of options passed as a parameter
	 */
	registerComponent<T extends ComponentOptions>(context: Context, options: T) {
		if (options instanceof CronJobOptions) {
			return new CronJobFactory(context, options)
		}
		if (options instanceof DaemonOptions) {
			return new DaemonFactory(context, options)
		}
		if (options instanceof JobOptions) {
			return new JobFactory(context, options)
		}
		if (options instanceof WebServiceOptions) {
			return new WebServiceFactory(context, options)
		}
	}
}
