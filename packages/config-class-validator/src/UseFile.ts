import { ConfigFileOptions } from '@mxvincent/config'
import { ConfigContainer } from './ConfigContainer'

export interface UseFile {
	useFile(): ConfigFileOptions
}

export function canUseFile(container: ConfigContainer<unknown>): container is ConfigContainer<any> & UseFile {
	return container && typeof (container as any).useFile === 'function'
}
