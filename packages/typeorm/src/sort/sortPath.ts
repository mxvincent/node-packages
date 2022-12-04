import { NonEmptyArray } from '@mxvincent/core'
import { Sort } from '@mxvincent/query'
import { ObjectType } from 'typeorm'

export const defaultSort = new Map<ObjectType<unknown>, Sort[]>()

export const setDefaultSort = <T>(entity: ObjectType<T>, sorts: Array<Sort<keyof T>>): void => {
	defaultSort.set(entity, sorts as any)
}

export const getDefaultSort = <T>(entity: ObjectType<T>): Array<Sort<keyof T>> => {
	return (defaultSort.get(entity) ?? []) as Array<Sort<keyof T>>
}

export const enforcePrimaryKeySort = <T>(
	sorts: Array<Sort<keyof T>>,
	primaryKeyColumns: NonEmptyArray<keyof T>
): NonEmptyArray<Sort<keyof T>> => {
	return [
		...sorts,
		...primaryKeyColumns
			.filter((column) => !sorts.find((sort) => sort.path === column))
			.map((column) => ({
				path: column,
				direction: 'asc'
			}))
	] as NonEmptyArray<Sort<keyof T>>
}
