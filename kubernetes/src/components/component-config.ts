import { Environment } from '@components/config/environment'
import { ConfigFiles } from '@components/config/file'

export interface ComponentConfig {
	environment?: Environment
	files?: ConfigFiles
	mountPath?: string
}
