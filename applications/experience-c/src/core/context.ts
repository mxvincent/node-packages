import { HttpRequestInfo } from '#/core/request'
import { getDataSource } from '#/database/data-source'
import { AsyncStore, AsyncStoreManager } from '@mxvincent/core'
import { logger } from '@mxvincent/telemetry'
import { TypeormDatabaseContext } from '@mxvincent/typeorm'

export interface ContextValues {
	database: TypeormDatabaseContext
	logger: typeof logger
	request?: HttpRequestInfo
}

export class ContextStore extends AsyncStore<ContextValues> {
	protected applyDefaults(values?: Partial<ContextValues>): ContextValues {
		return {
			database: values?.database ?? new TypeormDatabaseContext(getDataSource()),
			logger: values?.logger ?? logger
		}
	}
}

export const contextStore = new ContextStore()

export const contextManager = new AsyncStoreManager(contextStore)

export const context: Readonly<ContextValues> = new Proxy({} as ContextValues, {
	get(target, prop) {
		return contextStore.values[prop as keyof ContextValues]
	}
})
