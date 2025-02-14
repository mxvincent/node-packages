import { LABEL_COMPONENT, LABEL_INSTANCE, LABEL_NAME, LABEL_VERSION } from '#/helpers/labels'
import { getRevision } from '#/helpers/revision'
import { getApplicationScope } from '#/helpers/scope'
import { ObjectMeta } from '#/imports/k8s'
import { ExternalSecret } from '#/plugins/external-secret'
import { Chart as CDKChart } from 'cdk8s/lib/chart'

export const applications = ['experience-a', 'experience-b'] as const
export type Application = (typeof applications)[number]

export const environments = ['development', 'production', 'staging'] as const
export type Environment = (typeof environments)[number]

export type ContextOptions = {
	name: string
	revision?: string
	chart?: CDKChart
}

export abstract class Context {
	readonly application: Application
	readonly environment: Environment
	readonly revision: string
	readonly chart: CDKChart
	readonly name: string

	constructor(environment: Environment, application: Application, options: ContextOptions) {
		this.application = application
		this.environment = environment
		this.name = options.name
		this.revision = options?.revision ?? getRevision(application, environment)
		this.chart =
			options.chart ??
			new CDKChart(getApplicationScope(application), this.environment, {
				labels: this.labels,
				disableResourceNameHashes: true
			})
	}

	get secrets() {
		return {
			environment: new ExternalSecret(this.environment),
			application: new ExternalSecret(`${this.environment}-${this.application}`)
		}
	}

	get labels(): Record<string, string> {
		return {
			[LABEL_NAME]: this.application,
			[LABEL_VERSION]: this.revision,
			[LABEL_INSTANCE]: this.environment
		}
	}

	get metadata() {
		return {
			name: this.name,
			labels: this.labels
		} satisfies ObjectMeta
	}
}

export class ApplicationContext extends Context {
	constructor(environment: Environment, application: Application) {
		super(environment, application, {
			name: application
		})
	}

	extends(component: string) {
		return new ComponentContext(this, component)
	}
}

export class ComponentContext extends Context {
	parent: ApplicationContext
	component: string

	constructor(parent: ApplicationContext, component: string) {
		super(parent.environment, parent.application, {
			chart: parent.chart,
			name: `${parent.name}-${component}`,
			revision: parent.revision
		})
		this.parent = parent
		this.component = component
	}

	get secrets() {
		return {
			...this.parent.secrets,
			component: new ExternalSecret(`${this.environment}-${this.application}-${this.component}`)
		}
	}

	get labels() {
		return {
			...super.labels,
			[LABEL_COMPONENT]: this.component
		}
	}
}

export type Provider<V, C = ApplicationContext | ComponentContext> = (context: C) => V
