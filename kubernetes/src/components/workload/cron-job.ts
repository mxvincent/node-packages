import { WorkloadComponent, WorkloadComponentOptions } from '#/components/workload-component'
import { Cron } from 'cdk8s'
import { ConcurrencyPolicy, CronJob as CDKCronJob, RestartPolicy } from 'cdk8s-plus-31'

export interface CronJobOptions extends WorkloadComponentOptions {
	readonly schedule: Cron
}

export class CronJob extends WorkloadComponent<CronJobOptions> {
	generate() {
		const { context, options } = this

		// Configure job
		const job = new CDKCronJob(context.chart, context.name, {
			metadata: context.metadata,
			dockerRegistryAuth: options.imageRegistryAuth?.secret,
			schedule: options.schedule,
			concurrencyPolicy: ConcurrencyPolicy.FORBID,
			restartPolicy: RestartPolicy.ON_FAILURE,
			successfulJobsRetained: 3,
			podMetadata: context.metadata,
			securityContext: this.securityContext
		})

		// Configure job container
		const container = job.addContainer(this.containerProps)

		// Inject configuration
		this.mountConfiguration(job, container)
	}
}
