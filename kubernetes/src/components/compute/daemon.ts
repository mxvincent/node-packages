import { ComponentFactory } from '#/components/component-factory'
import { ComponentOptions } from '#/components/component-options'
import { Deployment } from 'cdk8s-plus-27'

export class DaemonOptions extends ComponentOptions {
	readonly replicas: number

	constructor({ replicas, ...options }: DaemonOptions) {
		super(options)
		this.replicas = replicas ?? 1
	}
}

export class DaemonFactory extends ComponentFactory<DaemonOptions> {
	createManifests() {
		const { context, options } = this

		// Configure deployment
		const deployment = new Deployment(context.chart, context.name, {
			replicas: options.replicas,
			dockerRegistryAuth: options.imageRegistryAuth?.secret,
			podMetadata: context.metadata
		})

		// Configure deployment container
		const container = deployment.addContainer(this.containerProps)

		// Inject configuration
		if (options.config) {
			this.mountConfiguration(deployment, container)
		}
	}
}
