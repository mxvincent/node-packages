import { Resource } from '@mxvincent/typeorm'
import { randomUUID } from 'node:crypto'

export const createResource = <T>(options?: Partial<Resource<T>>): Resource<T> => {
	return {
		id: options?.id ?? randomUUID(),
		createdAt: options?.createdAt ?? new Date(),
		updatedAt: options?.updatedAt ?? new Date()
	}
}

export declare abstract class SoftDeletableResource<T> extends Resource<T> {
	deletedAt: Date | null
}

export const createSortDeletableResource = <T>(
	options?: Partial<SoftDeletableResource<T>>
): SoftDeletableResource<T> => {
	return Object.assign(createResource(options), { deletedAt: options?.deletedAt ?? null })
}
