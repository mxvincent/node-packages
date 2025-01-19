import { LABEL_COMPONENT, LABEL_INSTANCE, LABEL_NAME, LABEL_VERSION } from '#/helpers/labels'
import { getRevision } from '#/helpers/revision'
import { getApplicationScope } from '#/helpers/scope'
import { ObjectMeta } from '#/imports/k8s'
import { Chart as CDKChart } from 'cdk8s/lib/chart'

export const applications = ['experience-a', 'experience-b'] as const
export type Application = (typeof applications)[number]

export const environments = ['development', 'production', 'staging'] as const
export type Environment = (typeof environments)[number]

export class Context {
	readonly application: Application
	readonly component?: string
	readonly environment: Environment
	readonly revision: string
	readonly chart: CDKChart

	constructor(
		environment: Environment,
		application: Application,
		{ component, ...options }: Partial<Pick<Context, 'chart' | 'revision' | 'component'>> = {}
	) {
		this.application = application
		this.component = component
		this.environment = environment
		this.revision = options.revision ?? getRevision(application, environment)
		// this.namespace = `${environment}-${application}`
		this.chart = this.chart =
			options.chart ??
			new CDKChart(getApplicationScope(application), this.environment, {
				labels: this.labels,
				disableResourceNameHashes: true
			})
	}

	get name(): string {
		return this.component ? `${this.application}-${this.component}` : this.application
	}

	get labels(): Record<string, string> {
		const labels: Record<string, string> = {
			[LABEL_NAME]: this.application,
			[LABEL_VERSION]: this.revision,
			[LABEL_INSTANCE]: this.environment
		}
		if (this.component) {
			labels[LABEL_COMPONENT] = this.component
		}
		return labels
	}

	get metadata(): ObjectMeta {
		return {
			name: this.name,
			labels: this.labels
		}
	}
	get image(): string {
		return `ghcr.io/mxvincent/${this.application}:${this.revision}`
	}

	extends(options: Required<Pick<Context, 'component'>>) {
		return new Context(this.environment, this.application, {
			chart: this.chart,
			revision: this.revision,
			component: options.component
		})
	}
}

export type Provider<T> = (context: Context) => T
