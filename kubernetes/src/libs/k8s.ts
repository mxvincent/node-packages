import { Size } from 'cdk8s'
import { ContainerResources, Cpu } from 'cdk8s-plus-27'

export type IngressAnnotations = {
	sslRedirect: boolean
	proxyBodySize: string
	certIssuer: string
}

export type IngressConfig = {
	host: string
	path?: string
	annotations?: Partial<IngressAnnotations>
}

export const getContainerResources = (options?: Partial<ContainerResources>): ContainerResources => {
	return {
		cpu: {
			request: options?.cpu?.request ?? Cpu.millis(50),
			limit: options?.cpu?.limit ?? undefined
		},
		memory: {
			request: options?.memory?.request ?? Size.mebibytes(100),
			limit: options?.memory?.limit ?? Size.mebibytes(250)
		}
	}
}
