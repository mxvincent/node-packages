import { invariant, KeyOf } from '@mxvincent/core'
import { Sort, SortDirection } from '@mxvincent/query-params'
import { orderBy } from 'es-toolkit'

// export function sortArrayWith<T extends object>(sorts: Sort<KeyOf<T>>[], array: T[]) {
// 	const result = [...array]
// 	for (const { direction, path } of sorts) {
// 		const pick = (o: T) => o[path]
// 		const sort = direction === 'ASC' ? ascending : descending
// 		result.sort((a, b) => sort(pick(a), pick(b)))
// 	}
// 	return result
// }

export function sortArrayWith<T extends object>(sorts: Sort<KeyOf<T>>[], array: T[]) {
	const paths: KeyOf<T>[] = []
	const orders: ('asc' | 'desc')[] = []
	for (const { direction, path } of sorts) {
		paths.push(path)
		orders.push(direction === SortDirection.ASC ? 'asc' : 'desc')
	}
	return orderBy(array, paths, orders)
}

export type Slice<T> = {
	data: T[]
	first: T
	last: T
	size: number
}

export const slice = <T>(
	collection: T[],
	options: {
		take: number
		skip?: number
	}
): Slice<T> => {
	if (!collection.length) {
		throw new Error('collection can not be empty')
	}
	if (options.take < 1) {
		throw new Error('take parameter should be <= 1')
	}
	options.skip ??= 0
	const data = collection.slice(options.skip, options.skip + options.take)
	return { data, first: invariant(data.at(0)), last: invariant(data.at(-1)), size: data.length }
}
