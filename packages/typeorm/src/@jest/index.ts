import { Sort } from '@mxvincent/query'
import { ascend, descend, prop, sortWith } from 'ramda'

const mapSortFunction = <T = unknown>({ direction, path }: Sort<keyof T>) => {
	return direction === 'asc' ? ascend(prop(path)) : descend(prop(path))
}

export const sortArrayWith = <T = unknown>(sorts: Sort<keyof T>[], list: T[]): T[] => {
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
