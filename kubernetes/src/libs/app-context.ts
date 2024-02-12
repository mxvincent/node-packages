import { ExternalSecretV1Beta1SpecDataRemoteRef } from '@imports/external-secrets.io'
import { ExternalSecretRef } from '@libs/app-config'
import { getRevision } from '@libs/app-revision'
import { getEnvironmentScope } from '@libs/argocd'
import { getApplicationLabels } from '@libs/k8s-labels'
import { Chart as CDKChart } from 'cdk8s/lib/chart'

export const applications = ['demo-graphql'] as const
export type Application = (typeof applications)[number]

export const environments = ['production', 'staging'] as const
export type Environment = (typeof environments)[number]

export class AppContext {
	readonly application: Application
	readonly environment: Environment
	readonly revision: string
	readonly image: string
	readonly namespace: `${Environment}-${Application}`
	readonly chart: CDKChart

	private readonly secretsRef: {
		application: ExternalSecretRef
		environment: ExternalSecretRef
	}

	constructor(application: Application, environment: Environment, revision?: string) {
		this.application = application
		this.environment = environment
		this.revision = revision ?? getRevision(application)
		this.image = `ghcr.io/mxvincent/${application}:${this.revision}`
		this.namespace = `${environment}-${application}`

		this.chart = new CDKChart(getEnvironmentScope(environment), application, {
			namespace: this.namespace,
			labels: getApplicationLabels(this),
			disableResourceNameHashes: true
		})

		this.secretsRef = {
			application: new ExternalSecretRef(`${environment}-${application}`),
			environment: new ExternalSecretRef(environment)
		}
	}

	applicationSecret(property: string): ExternalSecretV1Beta1SpecDataRemoteRef {
		return this.secretsRef.application.value(property)
	}

	environmentSecret(property: string): ExternalSecretV1Beta1SpecDataRemoteRef {
		return this.secretsRef.environment.value(property)
	}
}

/**
 * Function taking context as parameter to return a value
 */
export type ContextAdapter<T> = (context: AppContext) => T
