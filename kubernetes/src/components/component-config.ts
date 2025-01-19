import { Environment } from '#/components/config/environment'
import { ConfigFiles } from '#/components/config/file'

export const CONFIG_DIRECTORY = '/app/config'

export interface ComponentConfig {
	files?: ConfigFiles
	environment?: Environment
}
