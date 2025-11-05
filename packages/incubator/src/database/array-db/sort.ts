import { KeyOf } from '@mxvincent/core'
import { Sort, SortDirection } from '@mxvincent/query-params'
import { orderBy } from 'es-toolkit'

export function sortArrayWith<T extends object>(array: T[], sorts: Sort<KeyOf<T>>[]) {
	const paths: KeyOf<T>[] = []
	const orders: ('asc' | 'desc')[] = []
	for (const { direction, path } of sorts) {
		paths.push(path)
		orders.push(direction === SortDirection.ASC ? 'asc' : 'desc')
	}
	return orderBy(array, paths, orders)
}
