import { NonEmptyArray } from '@mxvincent/core'
import { EntityMetadata, ObjectType } from 'typeorm'

export const primaryKeys = new Map<ObjectType<unknown> | string, string[]>()

/**
 * Configure primary key fields for an entity
 */
export const setPrimaryKeyColumns = <T>(
	entity: ObjectType<T> | EntityMetadata['target'],
	columns: Array<keyof T>
): void => {
	if (columns.length === 0) {
		throw new Error(`Keys should be a non empty array of string.`)
	}
	primaryKeys.set(entity, [...columns] as string[])
}

/**
 * Get configured primary key for an entity
 */
export const getPrimaryKeyColumns = <T>(entity: ObjectType<T>): NonEmptyArray<keyof T> => {
	if (!primaryKeys.has(entity)) {
		throw new Error(`primary key is not configured for ${entity.name}`)
	}
	const columns = primaryKeys.get(entity) as Array<keyof T>
	if (!columns.length) {
		throw new Error(`Primary key should contain one to many columns.`)
	}
	return columns as NonEmptyArray<keyof T>
}
