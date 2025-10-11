import { Sort } from '@mxvincent/query-params'
import { encodeSortDirection } from './shared'

export const serializeSort = (sort: Sort) => {
	return `${encodeSortDirection(sort.direction)}(${sort.path})`
}

export const serializeSorts = (sorts: Sort[]) => {
	return sorts.map(serializeSort)
}
