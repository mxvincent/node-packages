import {
	ExternalSecretSpecDataRemoteRef,
	ExternalSecretV1Beta1,
	ExternalSecretV1Beta1SpecDataRemoteRef,
	ExternalSecretV1Beta1SpecTargetCreationPolicy
} from '@imports/external-secrets.io'
import { AppContext, ContextAdapter } from '@libs/app-context'
import { Names } from 'cdk8s'
import { EnvValue, ISecret, Secret } from 'cdk8s-plus-27'
import { is } from 'ramda'

/**
 * Config files secret
 */
export class ConfigFilesDescriptor {
	files = new Map<string, unknown>()
	secrets = new ExternalSecretProvider()
}

export const createConfigFile = (
	fn: (secrets: ExternalSecretProvider) => Record<string, unknown>
): ConfigFilesDescriptor => {
	const provider = new ConfigFilesDescriptor()
	provider.files.set('config.json', fn(provider.secrets))
	return provider
}

/**
 * Environment variables
 */
export class EnvironmentDescriptor {
	values = new Map<string, string>()
	secrets = new ExternalSecretProvider()
}

/**
 * Provide application config
 */
export type ConfigProviders = {
	configFiles?: ContextAdapter<ConfigFilesDescriptor>
	environment?: ContextAdapter<EnvironmentDescriptor>
}

/**
 * Helpers used to transform secret values
 */
export type SecretValueTransformHelper = 'toString'

/**
 * External secret reference
 */
export class ExternalSecretRef {
	readonly name: string

	constructor(name: string) {
		this.name = name
	}

	value(property: string): ExternalSecretV1Beta1SpecDataRemoteRef {
		return {
			key: `name:${this.name}`,
			conversionStrategy: 'Default',
			decodingStrategy: 'None',
			property: property,
			version: 'latest'
		}
	}
}

/**
 * Provide external secret reference
 */
export class ExternalSecretProvider {
	private secrets = new Map<string, ExternalSecretSpecDataRemoteRef>()

	get entries(): [string, ExternalSecretSpecDataRemoteRef][] {
		return [...this.secrets.entries()]
	}

	get count() {
		return this.secrets.size
	}

	private getSecretPlaceholder(name: string, transform: SecretValueTransformHelper[] = ['toString']) {
		if (transform.length === 0) {
			return `{{ .${name} }}`
		}
		return `{{ .${name} | ${transform.join(' | ')} }}`
	}

	private getSecretId(remoteRef: ExternalSecretSpecDataRemoteRef) {
		const base = remoteRef.key.replace(/^name:/, '').replace(/-/g, '_')
		if (!remoteRef.property) {
			return base.toUpperCase()
		}
		return `${base}_${remoteRef.property}`.toUpperCase()
	}

	inject(remoteRef: ExternalSecretSpecDataRemoteRef, transform?: SecretValueTransformHelper[]) {
		const id = this.getSecretId(remoteRef)
		if (!this.secrets.has(id)) {
			this.secrets.set(id, remoteRef)
		}
		return this.getSecretPlaceholder(id, transform)
	}
}

export class AppConfig {
	static readonly DOCKER_AUTH_EXTERNAL_SECRET_NAME = 'docker-auth'
	static readonly SECRET_REFRESH_INTERVAL = '1h'

	private readonly context: AppContext
	private readonly providers: ConfigProviders

	dockerRegistryAuthSecret: ISecret

	environment: Record<string, EnvValue>
	environmentSecret?: ISecret

	configFiles: string[]
	configFilesSecret?: ISecret

	get secretNames(): string[] {
		return [this.configFilesSecret?.name, this.environmentSecret?.name].filter(is(String))
	}

	constructor(context: AppContext, providers: ConfigProviders) {
		this.context = context
		this.providers = providers
		this.dockerRegistryAuthSecret = this.createDockerRegistryAuthSecret()
		this.environment = this.createEnvironmentSecret()
		this.configFiles = this.createConfigFilesSecret()
	}

	/**
	 * Create docker registry auth secret
	 */
	private createDockerRegistryAuthSecret(): ISecret {
		const { chart } = this.context
		const secretName = Names.toDnsLabel(chart, { extra: ['docker-auth'], includeHash: false })
		const secret = Secret.fromSecretName(chart, 'docker-auth', secretName)
		new ExternalSecretV1Beta1(chart, 'docker-auth-secret', {
			spec: {
				secretStoreRef: { kind: 'ClusterSecretStore', name: 'scaleway' },
				refreshInterval: AppConfig.SECRET_REFRESH_INTERVAL,
				target: {
					name: secretName,
					creationPolicy: ExternalSecretV1Beta1SpecTargetCreationPolicy.OWNER,
					template: {
						type: 'kubernetes.io/dockerconfigjson',
						data: {
							'.dockerconfigjson': '{{ .secret | toString }}'
						}
					}
				},
				data: [
					{
						secretKey: 'secret',
						remoteRef: {
							conversionStrategy: 'Default',
							decodingStrategy: 'None',
							key: `name:${AppConfig.DOCKER_AUTH_EXTERNAL_SECRET_NAME}`,
							version: 'latest'
						}
					}
				]
			}
		})
		return secret
	}

	/**
	 * Create config map containing application configuration files
	 */
	private createConfigFilesSecret(): string[] {
		const { context, providers } = this

		if (!providers.configFiles) {
			return []
		}

		const configFiles: string[] = []
		const { files, secrets } = providers.configFiles(context)

		const stringData: Record<string, string> = {}

		for (const [name, content] of files.entries()) {
			configFiles.push(name)
			stringData[name] = typeof content === 'string' ? content : JSON.stringify(content)
		}

		if (!secrets.count) {
			this.configFilesSecret = new Secret(context.chart, 'config-files', { stringData })
			return configFiles
		}

		const filesSecretName = Names.toDnsLabel(context.chart, { extra: ['config-files'], includeHash: false })
		this.configFilesSecret = Secret.fromSecretName(context.chart, 'config-files', filesSecretName)
		new ExternalSecretV1Beta1(context.chart, 'config-files-secrets', {
			spec: {
				refreshInterval: AppConfig.SECRET_REFRESH_INTERVAL,
				secretStoreRef: { kind: 'ClusterSecretStore', name: 'scaleway' },
				target: {
					name: filesSecretName,
					creationPolicy: ExternalSecretV1Beta1SpecTargetCreationPolicy.OWNER,
					template: {
						engineVersion: '2',
						data: stringData
					}
				},
				data: secrets.entries.map(([secretKey, remoteRef]) => ({ secretKey, remoteRef }))
			}
		})

		return configFiles
	}

	/**
	 * Generate environment variables for applications components
	 */
	private createEnvironmentSecret(): Record<string, EnvValue> {
		const { context, providers } = this

		if (!providers.environment) {
			return {}
		}

		const environment: Record<string, EnvValue> = {}
		const { secrets, values } = providers.environment(context)

		for (const [key, value] of values) {
			environment[key] = EnvValue.fromValue(value)
		}

		if (secrets) {
			const secretName = Names.toDnsLabel(context.chart, { extra: ['env-variables'], includeHash: false })
			const envVariablesSecret = Secret.fromSecretName(context.chart, 'env-variables', secretName)
			new ExternalSecretV1Beta1(context.chart, 'env-secrets', {
				spec: {
					refreshInterval: AppConfig.SECRET_REFRESH_INTERVAL,
					secretStoreRef: { kind: 'ClusterSecretStore', name: 'scaleway' },
					target: {
						name: secretName,
						creationPolicy: ExternalSecretV1Beta1SpecTargetCreationPolicy.OWNER
					},
					data: secrets.entries.map(([secretKey, remoteRef]) => ({ secretKey, remoteRef }))
				}
			})
			for (const [key] of secrets.entries) {
				environment[key] = envVariablesSecret.envValue(key)
			}
		}

		return environment
	}
}
