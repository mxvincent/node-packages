import { ComponentFactory } from '#/components/component-factory'
import { ComponentOptions } from '#/components/component-options'
import { Cron } from 'cdk8s'
import { ConcurrencyPolicy, CronJob, RestartPolicy } from 'cdk8s-plus-27'

export class CronJobOptions extends ComponentOptions {
	readonly schedule: Cron

	constructor({ schedule, ...options }: CronJobOptions) {
		super(options)
		this.schedule = schedule
	}
}

export class CronJobFactory extends ComponentFactory<CronJobOptions> {
	createManifests() {
		const { context, options } = this

		// Configure job
		const job = new CronJob(context.chart, context.name, {
			dockerRegistryAuth: options.imageRegistryAuth?.secret,
			schedule: options.schedule,
			concurrencyPolicy: ConcurrencyPolicy.FORBID,
			restartPolicy: RestartPolicy.ON_FAILURE,
			successfulJobsRetained: 2,
			podMetadata: context.metadata
		})

		// Configure job container
		const container = job.addContainer(this.containerProps)

		// Inject configuration
		if (options.config) {
			this.mountConfiguration(job, container)
		}
	}
}
