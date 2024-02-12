import { Sort, SortDirection } from '@mxvincent/query-params'
import { KeyOf } from '@mxvincent/utils'
import { ascend, descend, prop, sortWith } from 'ramda'

// TODO: remove any cast
const mapSortFunction = <T extends object>({ direction, path }: Sort<KeyOf<T>>) => {
	return direction === SortDirection.ascending ? ascend(prop(path) as never) : descend(prop(path) as never)
}

export const sortArrayWith = <T extends object>(sorts: Sort<KeyOf<T>>[], list: T[]): T[] => {
	return sortWith(sorts.map(mapSortFunction), list)
}

export type Slice<T> = {
	data: T[]
	first: T
	last: T
}

export const slice = <T>(skip: number, take: number, collection: T[]): Slice<T> => {
	const data = collection.slice(skip, skip + take)
	return { data, first: data[0], last: data[data.length - 1] }
}
