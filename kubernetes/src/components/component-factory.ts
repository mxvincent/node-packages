import { CONFIG_DIRECTORY } from '#/components/component-config'
import { ComponentOptions } from '#/components/component-options'
import { Context } from '#/helpers/context'
import { getContainerResources } from '#/helpers/resources'
import { ReloaderAnnotation } from '#/plugins/reloader'
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
			name: this.context.name,
			command: this.options.command,
			image: this.options.image,
			resources: getContainerResources(),
			envVariables: this.options.config?.environment?.values,
			securityContext: {
				privileged: false,
				readOnlyRootFilesystem: true,
				ensureNonRoot: true,
				allowPrivilegeEscalation: false
			}
		}
	}

	abstract createManifests(): void

	protected mountConfiguration(pod: AbstractPod, container: Container) {
		const { config } = this.options
		if (!config) {
			return
		}
		// Inject configuration
		if (config.files) {
			config.files.mount(pod, { container, path: CONFIG_DIRECTORY })
		}
		// Handle application reload on secret change
		const secrets = Object.values(config)
			.flatMap(({ secret }) => (secret ? [secret.name] : []))
			.join(',')
		if (secrets.length) {
			pod.metadata.addAnnotation(ReloaderAnnotation.RELOAD_ON_SECRET_CHANGE, secrets)
		}
	}
}
