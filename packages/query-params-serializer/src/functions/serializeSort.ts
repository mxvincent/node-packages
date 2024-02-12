import { Sort } from '@mxvincent/query-params'

export const serializeSort = (sort: Sort) => {
	return `${sort.direction}(${sort.path})`
}

export const serializeSorts = (sorts: Sort[]) => {
	return sorts.map(serializeSort)
}
