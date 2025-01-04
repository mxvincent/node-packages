import { ComponentFactory } from '@components/component-factory'
import { ComponentOptions } from '@components/component-options'
import { LABEL_COMPONENT } from '@helpers/labels'
import { CertManagerAnnotation } from '@plugins/cert-manager'
import { IngressAnnotation, IngressAnnotations, IngressConfig, NginxIngressAnnotation } from '@plugins/ingress'
import { Deployment, Ingress, IngressBackend, Secret } from 'cdk8s-plus-27'

export class WebServiceOptions extends ComponentOptions {
	readonly replicas: number
	readonly ingress?: IngressConfig

	constructor({ replicas, ingress, ...options }: WebServiceOptions) {
		super(options)
		this.replicas = replicas ?? 1
		this.ingress = ingress
	}
}

export class WebServiceFactory extends ComponentFactory<WebServiceOptions> {
	static readonly HTTP_PORT = 4000

	createManifests() {
		const { options, context } = this

		// Configure deployment
		const deployment = new Deployment(context.chart, options.name, {
			dockerRegistryAuth: options.imageRegistryAuth?.secret,
			replicas: options.replicas,
			podMetadata: {
				labels: context.labels
			},
			securityContext: {
				fsGroup: 1000,
				user: 1000,
				group: 1000
			}
		})
		deployment.metadata.addLabel(LABEL_COMPONENT, options.name)

		// Configure deployment container
		const container = deployment.addContainer({
			...this.containerProps,
			ports: [{ name: 'http', number: WebServiceFactory.HTTP_PORT }]
		})

		// Inject configuration
		if (options.config) {
			this.mountConfiguration(deployment, container)
		}

		// Expose application with a service
		const service = deployment.exposeViaService({
			name: deployment.name
		})
		service.metadata.addLabel(LABEL_COMPONENT, options.name)

		// Expose application with and ingress (optional)
		if (options.ingress) {
			const certSecret = Secret.fromSecretName(
				context.chart,
				'ingress-cert-secret',
				`${context.application}-${options.name}-cert`
			)
			const annotation = (key: keyof IngressAnnotations, defaultValue: unknown): string => {
				return String(options.ingress?.annotations?.[key] ?? defaultValue)
			}
			const ingress = new Ingress(context.chart, 'ingress', {
				tls: [
					{
						hosts: [options.ingress.host],
						secret: certSecret
					}
				],
				metadata: {
					name: deployment.name,
					annotations: {
						[CertManagerAnnotation.CERT_ISSUER]: annotation('certIssuer', 'acme'),
						[IngressAnnotation.SSL_REDIRECT]: annotation('sslRedirect', true)
					}
				}
			})
			ingress.addHostRule(options.ingress.host, options.ingress.path ?? '/', IngressBackend.fromService(service))
			ingress.metadata.addLabel(LABEL_COMPONENT, options.name)
			if (options.ingress.annotations?.proxyBodySize) {
				ingress.metadata.addAnnotation(
					NginxIngressAnnotation.PROXY_BODY_SIZE,
					options.ingress.annotations.proxyBodySize
				)
			}
		}
	}
}
