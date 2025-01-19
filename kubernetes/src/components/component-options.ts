import { ComponentConfig } from '#/components/component-config'
import { ImageRegistryAuth } from '#/components/config/registry-auth'

export abstract class ComponentOptions {
	readonly command: string[]
	readonly image: string
	readonly imageRegistryAuth?: ImageRegistryAuth
	readonly config?: ComponentConfig

	protected constructor(options: ComponentOptions) {
		this.command = options.command
		this.image = options.image
		this.imageRegistryAuth = options.imageRegistryAuth
		this.config = options.config
	}
}
