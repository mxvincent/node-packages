import { ExternalSecretSpecSecretStoreRef, ExternalSecretV1Beta1SpecDataRemoteRef } from '@imports/external-secrets.io'

export const EXTERNAL_SECRET_REFRESH_INTERVAL = '1h'
export const EXTERNAL_SECRET_STORE: ExternalSecretSpecSecretStoreRef = {
	kind: 'ClusterSecretStore',
	name: 'scaleway'
}
/**
 * Helpers used to transform secret values
 */
export type SecretValueTransformHelper = 'toString'

export class ExternalSecretRef {
	readonly externalSecretName: string
	readonly remoteRef: ExternalSecretV1Beta1SpecDataRemoteRef

	constructor(secretName: string, options: { property: string; version?: string }) {
		this.externalSecretName = secretName
		this.remoteRef = {
			key: `name:${secretName}`,
			property: options.property,
			conversionStrategy: 'Default',
			decodingStrategy: 'None',
			version: 'latest',
			metadataPolicy: 'None'
		}
	}

	private formatId(value: string): string {
		return value.replace(/-/g, '_').toUpperCase()
	}

	/**
	 * Generate an id used to link template placeholder to the generated secret value
	 */
	get key(): string {
		if (this.remoteRef.property) {
			return this.formatId(`${this.externalSecretName}_${this.remoteRef.property}`)
		}
		return this.formatId(this.externalSecretName)
	}

	/**
	 * Generate a placeholder to replace external secret reference in template
	 */
	placeholder(transform: SecretValueTransformHelper = 'toString') {
		return `{{ .${this.key} | ${transform} }}`
	}
}

/**
 * Create external secret property reference
 */
export class ExternalSecret {
	readonly name: string

	constructor(name: string) {
		this.name = name
	}

	ref(property: string): ExternalSecretRef {
		return new ExternalSecretRef(this.name, { property })
	}
}
