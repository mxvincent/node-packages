import { Environment } from '#/components/config/environment'
import { ConfigFiles } from '#/components/config/file'

export const CONFIG_FILE_PATH = `/app/config.json`

export interface ComponentConfig {
	files?: ConfigFiles
	environment?: Environment
}
