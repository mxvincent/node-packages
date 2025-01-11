import { ComponentConfig } from '#/components/component-config'
import { ImageRegistryAuth } from '#/components/config/registry-auth'

export abstract class ComponentOptions {
	readonly name: string
	readonly command: string[]
	readonly image: string
	readonly imageRegistryAuth?: ImageRegistryAuth
	readonly config?: ComponentConfig

	protected constructor(options: ComponentOptions) {
		this.name = options.name
		this.command = options.command
		this.image = options.image
		this.imageRegistryAuth = options.imageRegistryAuth
		this.config = options.config
	}
}
