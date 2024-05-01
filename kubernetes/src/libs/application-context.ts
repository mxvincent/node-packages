import { Application } from '@libs/application'
import { Environment, getEnvironmentScope } from '@libs/environment'
import { LABEL_INSTANCE, LABEL_NAME, LABEL_VERSION } from '@libs/labels'
import { getRevision } from '@libs/revision'
import { Chart as CDKChart } from 'cdk8s/lib/chart'

export class ApplicationContext {
	readonly namespace: `${Environment}-${Application}`
	readonly application: Application
	readonly environment: Environment
	readonly revision: string
	readonly chart: CDKChart

	constructor(
		environment: Environment,
		application: Application,
		options: Partial<Pick<ApplicationContext, 'chart' | 'revision'>> = {}
	) {
		this.namespace = `${environment}-${application}`
		this.application = application
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

	get image(): string {
		return `ghcr.io/mxvincent/${this.application}:${this.revision}`
	}

	get labels(): Record<string, string> {
		return {
			[LABEL_NAME]: this.application,
			[LABEL_VERSION]: this.revision,
			[LABEL_INSTANCE]: this.environment
		}
	}
}
