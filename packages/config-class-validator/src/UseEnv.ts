import { EnvironmentVariableMapping } from '@mxvincent/config'
import { ConfigContainer } from './ConfigContainer'

export interface UseEnv {
	useEnv(): EnvironmentVariableMapping
}

export function canUseEnv(container: ConfigContainer<unknown>): container is ConfigContainer<any> & UseEnv {
	return container && typeof (container as any).useEnv === 'function'
}
