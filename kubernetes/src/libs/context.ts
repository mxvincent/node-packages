import { Application } from '@libs/application'
import { Environment, getEnvironmentScope } from '@libs/environment'
import { LABEL_COMPONENT, LABEL_INSTANCE, LABEL_NAME, LABEL_VERSION } from '@libs/labels'
import { getRevision } from '@libs/revision'
import { Chart as CDKChart } from 'cdk8s/lib/chart'

export class Context {
	readonly namespace: `${Environment}-${Application}`
	readonly application: Application
	readonly component?: string
	readonly environment: Environment
	readonly revision: string
	readonly chart: CDKChart

	constructor(
		environment: Environment,
		application: Application,
		options: Partial<Pick<Context, 'chart' | 'revision' | 'component'>> = {}
	) {
		this.namespace = `${environment}-${application}`
		this.application = application
		this.component = options.component
		this.environment = environment
		this.revision = options.revision ?? getRevision(application, environment)
		this.chart =
			options.chart ??
			new CDKChart(getEnvironmentScope(this.environment), this.application, {
				namespace: this.namespace,
				labels: this.labels,
				disableResourceNameHashes: true
			})
	}

	extends(options: Required<Pick<Context, 'component'>>) {
		return new Context(this.environment, this.application, {
			chart: this.chart,
			revision: this.revision,
			component: options.component
		})
	}

	get image(): string {
		return `ghcr.io/mxvincent/${this.application}:${this.revision}`
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
}

export type Provider<T> = (context: Context) => T
