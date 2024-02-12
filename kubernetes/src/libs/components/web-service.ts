import { ComponentFactory } from '@libs/app-component'
import { IngressAnnotations, IngressConfig } from '@libs/k8s'
import {
	ANNOTATION_CERT_ISSUER,
	ANNOTATION_PROXY_BODY_SIZE,
	ANNOTATION_RELOAD_ON_SECRET_CHANGE,
	ANNOTATION_SSL_REDIRECT
} from '@libs/k8s-annotations'
import { LABEL_COMPONENT } from '@libs/k8s-labels'
import { Options } from '@libs/misc'
import { Deployment, EnvValue, Ingress, IngressBackend, Secret, Volume } from 'cdk8s-plus-27'
import { includes } from 'ramda'

export class WebServiceOptions {
	readonly name: string
	readonly command: string[]
	readonly replicas: number
	readonly ingress?: IngressConfig

	constructor(name: string, options: Options<WebServiceOptions, 'command'>) {
		this.name = name
		this.command = options.command
		this.replicas = options.replicas ?? 1
		this.ingress = options.ingress ?? undefined
	}
}

export class WebServiceFactory extends ComponentFactory<WebServiceOptions> {
	static readonly HTTP_PORT = 4000

	createResources() {
		const { chart, component, config, context } = this

		const deployment = new Deployment(chart, component.name, {
			replicas: component.replicas,
			dockerRegistryAuth: config.dockerRegistryAuthSecret,
			podMetadata: {
				labels: this.labels
			}
		})
		deployment.metadata.addLabel(LABEL_COMPONENT, component.name)
		deployment.metadata.addAnnotation(ANNOTATION_RELOAD_ON_SECRET_CHANGE, config.secretNames.join(','))

		const container = deployment.addContainer({
			...this.containerProps,
			ports: [{ name: 'http', number: WebServiceFactory.HTTP_PORT }]
		})

		// Apply configuration files
		if (config.configFilesSecret) {
			const volume = Volume.fromSecret(chart, `${component.name}-config-files`, config.configFilesSecret)
			deployment.addVolume(volume)
			for (const file of config.configFiles) {
				container.mount(`/app/${file}`, volume, { subPath: file })
			}
			if (includes('config.json', config.configFiles)) {
				container.env.addVariable('CONFIG_FILE_PATH', EnvValue.fromValue('/app/config.json'))
			}
		}

		// Expose application with a service (private network)
		const service = deployment.exposeViaService({
			name: deployment.name
		})
		service.metadata.addLabel(LABEL_COMPONENT, component.name)

		// Expose application with and ingress (public network)
		if (component.ingress) {
			const options = component.ingress
			const certSecret = Secret.fromSecretName(
				chart,
				'ingress-cert-secret',
				`${context.application}-${component.name}-cert`
			)
			const annotation = (key: keyof IngressAnnotations, defaultValue: unknown): string => {
				return String(options.annotations?.[key] ?? defaultValue)
			}
			const ingress = new Ingress(chart, 'ingress', {
				tls: [
					{
						hosts: [options.host],
						secret: certSecret
					}
				],
				metadata: {
					name: deployment.name,
					annotations: {
						[ANNOTATION_CERT_ISSUER]: annotation('certIssuer', 'acme'),
						[ANNOTATION_SSL_REDIRECT]: annotation('sslRedirect', true)
					}
				}
			})
			ingress.addHostRule(options.host, options.path ?? '/', IngressBackend.fromService(service))
			ingress.metadata.addLabel(LABEL_COMPONENT, component.name)
			if (options.annotations?.proxyBodySize) {
				ingress.metadata.addAnnotation(ANNOTATION_PROXY_BODY_SIZE, options.annotations.proxyBodySize)
			}
		}
	}
}
