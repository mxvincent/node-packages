import { Context } from '#/helpers/context'
import {
	ExternalSecretV1Beta1,
	ExternalSecretV1Beta1SpecTargetCreationPolicy,
	ExternalSecretV1Beta1SpecTargetTemplateEngineVersion
} from '#/imports/external-secrets.io'
import { EXTERNAL_SECRET_REFRESH_INTERVAL, EXTERNAL_SECRET_STORE, ExternalSecretRef } from '#/plugins/external-secret'
import { AbstractPod, Container, ISecret, Secret, Volume } from 'cdk8s-plus-27'
import { join } from 'node:path'

export type JSONLike<T> = T | { [x: string]: JSONLike<T> } | Array<JSONLike<T>>
export type ConfigFilesTemplate = JSONLike<boolean | number | string>

export interface ConfigFilesMountOptions {
	container: Container
	path: string
	files?: string[]
}

/**
 * Config file value
 */
export type ConfigFilesValueWithSecretRef = JSONLike<boolean | number | string | ExternalSecretRef>

export type ConfigFilesOptions = {
	/**
	 * Name of the kubernetes resource
	 */
	name: string

	/**
	 * Data is used to create config map content
	 * Values can be a string or a json or a reference to an external secret
	 */
	data: Record<string, ConfigFilesValueWithSecretRef>
}

export class ConfigFiles {
	readonly context: Context
	readonly templates: Record<string, ConfigFilesTemplate> = {}
	readonly secretRefs: Record<string, ExternalSecretRef> = {}
	readonly secretName: string
	#secret?: ISecret

	constructor(context: Context, data: Record<string, ConfigFilesValueWithSecretRef>, options?: ConfigFilesOptions) {
		this.context = context
		this.secretName = options?.name ?? `${this.context.name}-config-files`

		for (const [name, value] of Object.entries(data)) {
			this.templates[name] = this.#transform(value)
		}
	}

	/**
	 * Return secret containing config files
	 * Manifests will be generated during the first call of this property
	 */
	get secret() {
		return (this.#secret ??= this.createManifests())
	}

	createManifests(): ISecret {
		if (this.#secret) {
			throw new Error('ConfigFile.createManifests() should be called exactly once.')
		}

		const metadata = {
			name: this.secretName,
			labels: this.context.labels
		}

		const stringData: Record<string, string> = {}
		for (const [key, value] of Object.entries(this.templates)) {
			stringData[key] = typeof value === 'string' ? value : JSON.stringify(value)
		}

		if (!Object.keys(this.secretRefs).length) {
			return new Secret(this.context.chart, this.#id(), { stringData })
		}

		const secret = Secret.fromSecretName(this.context.chart, this.#id('secret'), this.secretName)
		new ExternalSecretV1Beta1(this.context.chart, this.#id('external-secret'), {
			metadata,
			spec: {
				refreshInterval: EXTERNAL_SECRET_REFRESH_INTERVAL,
				secretStoreRef: EXTERNAL_SECRET_STORE,
				target: {
					name: secret.name,
					creationPolicy: ExternalSecretV1Beta1SpecTargetCreationPolicy.OWNER,
					template: {
						engineVersion: ExternalSecretV1Beta1SpecTargetTemplateEngineVersion.V2,
						data: stringData
					}
				},
				data: Object.values(this.secretRefs).map((secret) => ({
					remoteRef: secret.remoteRef,
					secretKey: secret.key
				}))
			}
		})
		return secret
	}

	mount(pod: AbstractPod, options: ConfigFilesMountOptions) {
		// Add volume in pod
		const volume = Volume.fromSecret(this.context.chart, this.#id('volume'), this.secret, {
			name: 'config-files'
		})
		pod.addVolume(volume)

		// Mount volume in containers
		for (const fileName of options.files ?? Object.keys(this.templates)) {
			options.container.mount(join(options.path, fileName), volume, { subPath: fileName })
		}
	}

	/**
	 * Generate an identifier for generated resources
	 */
	#id(suffix?: string) {
		return suffix ? `${this.secretName}-${suffix}` : this.secretName
	}

	#transform(value: ConfigFilesValueWithSecretRef): ConfigFilesTemplate {
		if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
			return value
		}
		if (value instanceof ExternalSecretRef) {
			this.secretRefs[value.key] = value
			return value.placeholder()
		}
		if (Array.isArray(value)) {
			return value.map((item) => this.#transform(item))
		}
		return Object.entries(value).reduce(
			(record, [key, value]) => Object.assign(record, { [key]: this.#transform(value) }),
			{}
		)
	}
}
