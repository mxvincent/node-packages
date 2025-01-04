import { ExternalSecretV1Beta1, ExternalSecretV1Beta1SpecTargetCreationPolicy } from '@imports/external-secrets.io'
import { Context } from '@libs/context'
import { EXTERNAL_SECRET_REFRESH_INTERVAL } from '@plugins/external-secret'

import { Names } from 'cdk8s'
import { ISecret, Secret } from 'cdk8s-plus-27'

export class ImageRegistryAuth {
	context: Context
	secret: ISecret
	resourceId = 'docker-auth'
	externalSecretName = 'image-registry-auth'

	constructor(context: Context) {
		this.context = context
		this.secret = this.createDockerRegistryAuthSecret()
	}

	/**
	 * Create docker registry auth secret
	 */
	private createDockerRegistryAuthSecret(): ISecret {
		const { chart } = this.context
		const secretName = Names.toDnsLabel(chart, { extra: ['docker-auth'], includeHash: false })
		const secret = Secret.fromSecretName(chart, this.resourceId, secretName)
		new ExternalSecretV1Beta1(chart, `${this.resourceId}-secret`, {
			spec: {
				secretStoreRef: { kind: 'ClusterSecretStore', name: 'scaleway' },
				refreshInterval: EXTERNAL_SECRET_REFRESH_INTERVAL,
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
							key: `name:${this.externalSecretName}`,
							version: 'latest'
						}
					}
				]
			}
		})
		return secret
	}
}
