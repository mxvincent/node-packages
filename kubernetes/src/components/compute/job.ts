import { ComponentFactory } from '#/components/component-factory'
import { ComponentOptions } from '#/components/component-options'
import { LABEL_COMPONENT } from '#/helpers/labels'
import { ArgoCDAnnotation, ArgocdHook, ArgocdHookDeletePolicy } from '#/plugins/argocd'
import { Duration } from 'cdk8s'
import { Job, RestartPolicy } from 'cdk8s-plus-27'

export class JobOptions extends ComponentOptions {
	readonly hook: ArgocdHook | null
	readonly deletePolicy: ArgocdHookDeletePolicy | null
	readonly activeDeadline: Duration

	constructor({ activeDeadline, hook, deletePolicy, ...options }: JobOptions) {
		super(options)
		this.hook = hook ?? ArgocdHook.Sync
		this.deletePolicy = deletePolicy ?? ArgocdHookDeletePolicy.BeforeHookCreation
		this.activeDeadline = activeDeadline ?? Duration.hours(1)
	}
}

export class JobFactory extends ComponentFactory<JobOptions> {
	createManifests() {
		const { context, options } = this

		// Configure job
		const job = new Job(context.chart, options.name, {
			dockerRegistryAuth: options.imageRegistryAuth?.secret,
			restartPolicy: RestartPolicy.ON_FAILURE,
			activeDeadline: options.activeDeadline,
			podMetadata: {
				labels: context.labels
			}
		})
		job.metadata.addLabel(LABEL_COMPONENT, options.name)
		job.metadata.addAnnotation(ArgoCDAnnotation.SYNC_OPTIONS, 'Replace=true')
		if (options.hook) {
			job.metadata.addAnnotation(ArgoCDAnnotation.HOOK, options.hook)
		}
		if (options.deletePolicy) {
			job.metadata.addAnnotation(ArgoCDAnnotation.HOOK_DELETE_POLICY, options.deletePolicy)
		}

		// Configure job container
		const container = job.addContainer(this.containerProps)

		// Inject configuration
		if (options.config) {
			this.mountConfiguration(job, container)
		}
	}
}
