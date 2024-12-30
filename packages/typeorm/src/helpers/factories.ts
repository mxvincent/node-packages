import { randomUUID } from 'node:crypto'
import type { Resource } from './entities'
import { DeletableResource } from './entities'

export const resourceFactory = (options?: Partial<Resource>): Resource => {
	return {
		id: options?.id ?? randomUUID(),
		createdAt: options?.createdAt ?? new Date(),
		updatedAt: options?.updatedAt ?? new Date()
	}
}

export const deletableResourceFactory = (options?: Partial<DeletableResource>): DeletableResource => {
	return Object.assign(resourceFactory(options), { deletedAt: options?.deletedAt ?? null })
}
