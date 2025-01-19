import { Context } from '#/helpers/context'
import {
	ExternalSecretV1Beta1,
	ExternalSecretV1Beta1SpecDataRemoteRef,
	ExternalSecretV1Beta1SpecSecretStoreRefKind,
	ExternalSecretV1Beta1SpecTargetCreationPolicy
} from '#/imports/external-secrets.io'
import { EXTERNAL_SECRET_REFRESH_INTERVAL } from '#/plugins/external-secret'

import { Names } from 'cdk8s'
import { EnvValue, ISecret, Secret } from 'cdk8s-plus-27'

export type EnvironmentValue = string | ExternalSecretV1Beta1SpecDataRemoteRef

export class Environment {
	readonly context: Context
	readonly values: Record<string, EnvValue> = {}
	// readonly resourceId = 'environment-variables'
	secret?: ISecret
	readonly #externalSecretValues: Record<string, ExternalSecretV1Beta1SpecDataRemoteRef> = {}

	constructor(context: Context, values: Record<string, EnvironmentValue>) {
		this.context = context
		for (const [key, value] of Object.entries(values)) {
			if (typeof value === 'string') {
				this.#setValue(key, value)
			} else {
				this.#setExternalSecretValue(key, value)
			}
		}
		if (Object.keys(this.#externalSecretValues).length) {
			this.#registerExternalSecret(this.#externalSecretValues)
		}
	}

	get #name(): string {
		return `${this.context.name}-environment-variables`
	}

	/**
	 * Initialize on the flight and return a secret reference
	 * @private
	 */
	get #initializedSecret() {
		this.secret ??= Secret.fromSecretName(
			this.context.chart,
			this.#name,
			Names.toDnsLabel(this.context.chart, { extra: ['environment'], includeHash: false })
		)
		return this.secret
	}

	/**
	 * Set a string value
	 */
	#setValue(key: string, value: string) {
		this.values[key] = EnvValue.fromValue(value)
	}

	/**
	 * Set a value referencing an external secret
	 */
	#setExternalSecretValue(key: string, value: ExternalSecretV1Beta1SpecDataRemoteRef) {
		const secret = this.#initializedSecret
		this.values[key] = secret.envValue(key)
		this.#externalSecretValues[key] = value
	}

	/**
	 * Create external secret
	 */
	#registerExternalSecret(values: Record<string, ExternalSecretV1Beta1SpecDataRemoteRef>) {
		const secret = this.#initializedSecret
		new ExternalSecretV1Beta1(this.context.chart, 'env-secrets', {
			spec: {
				refreshInterval: EXTERNAL_SECRET_REFRESH_INTERVAL,
				secretStoreRef: {
					kind: ExternalSecretV1Beta1SpecSecretStoreRefKind.CLUSTER_SECRET_STORE,
					name: 'scaleway'
				},
				target: {
					name: secret.name,
					creationPolicy: ExternalSecretV1Beta1SpecTargetCreationPolicy.OWNER
				},
				data: Object.entries(values).map(([secretKey, remoteRef]) => ({ secretKey, remoteRef }))
			}
		})
	}
}
