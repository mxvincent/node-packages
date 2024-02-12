import { AppConfig } from '@libs/app-config'
import { AppContext } from '@libs/app-context'
import { getContainerResources } from '@libs/k8s'
import { getApplicationLabels } from '@libs/k8s-labels'
import { Chart } from 'cdk8s'
import { ContainerProps } from 'cdk8s-plus-27'

export type ComponentInterface = {
	readonly name: string
	readonly command: string[]
}

export type ComponentFactoryOptions<ComponentOptions extends ComponentInterface> = {
	context: AppContext
	config: AppConfig
	component: ComponentOptions
}

export abstract class ComponentFactory<Component extends ComponentInterface> {
	protected readonly chart: Chart
	protected readonly context: AppContext
	protected readonly config: AppConfig
	protected readonly component: Component

	constructor(chart: Chart, options: ComponentFactoryOptions<Component>) {
		this.chart = chart
		this.context = options.context
		this.config = options.config
		this.component = options.component
		this.createResources()
	}

	protected get containerProps(): ContainerProps {
		return {
			name: this.component.name,
			command: this.component.command,
			image: this.context.image,
			resources: getContainerResources(),
			envVariables: this.config.environment,
			securityContext: {
				readOnlyRootFilesystem: true,
				ensureNonRoot: false
			}
		}
	}

	protected get labels() {
		return getApplicationLabels(this.context, this.component)
	}

	abstract createResources(): void
}
