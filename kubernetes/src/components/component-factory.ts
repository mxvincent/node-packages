import { ComponentOptions } from '@components/component-options'
import { Context } from '@libs/context'
import { ReloaderAnnotation } from '@libs/extentions/reloader'
import { getContainerResources } from '@libs/resources'
import { AbstractPod, Container, ContainerProps } from 'cdk8s-plus-27'

export abstract class ComponentFactory<Options extends ComponentOptions> {
	protected readonly context: Context
	protected readonly options: Options

	constructor(context: Context, options: Options) {
		this.context = context
		this.options = options
		this.createManifests()
	}

	protected get containerProps(): ContainerProps {
		return {
			name: this.options.name,
			command: this.options.command,
			image: this.options.image,
			resources: getContainerResources(),
			envVariables: this.options.config?.environment?.values,
			securityContext: {
				readOnlyRootFilesystem: true,
				ensureNonRoot: true,
				allowPrivilegeEscalation: false
			}
		}
	}

	protected mountConfiguration(pod: AbstractPod, container: Container) {
		const { config } = this.options
		if (!config) {
			return
		}
		// Inject configuration
		if (config.files) {
			config.files.mount(pod, { container, path: config.mountPath ?? '/app' })
		}
		// Handle application reload on secret change
		const secrets = Object.values(config)
			.flatMap(({ secret }) => (secret ? [secret.name] : []))
			.join(',')
		if (secrets.length) {
			pod.metadata.addAnnotation(ReloaderAnnotation.RELOAD_ON_SECRET_CHANGE, secrets)
		}
	}

	abstract createManifests(): void
}
