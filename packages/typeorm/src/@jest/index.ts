import { invariant, KeyOf } from '@mxvincent/core'
import { Sort, SortDirection } from '@mxvincent/query-params'
import { ascend, descend, prop, sortWith } from 'ramda'

// TODO: remove any cast
const mapSortFunction = <T extends object>({ direction, path }: Sort<KeyOf<T>>) => {
	return direction === SortDirection.ASC ? ascend(prop(path) as never) : descend(prop(path) as never)
}

export const sortArrayWith = <T extends object>(sorts: Sort<KeyOf<T>>[], list: T[]): T[] => {
	return sortWith(sorts.map(mapSortFunction), list)
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
