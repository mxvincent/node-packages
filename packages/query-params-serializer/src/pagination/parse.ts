import { Pagination } from '@mxvincent/query-params'
import { is } from 'ramda'
import { QueryStringRecord } from '../types/QueryStringRecord'

const normalizePaginationParameters = (queryStringRecord: QueryStringRecord): Record<string, string> => {
	return ['after', 'before', 'first'].reduce((normalizedRecord, key) => {
		const value = queryStringRecord[key]
		return value ? Object.assign(normalizedRecord, { [key]: is(Array, value) ? value[0] : value }) : normalizedRecord
	}, {})
}

export const parsePagination = (
	queryStringRecord: QueryStringRecord,
	options?: {
		defaultPageSize?: number
	}
): Pagination => {
	const { after, before, first } = normalizePaginationParameters(queryStringRecord)
	const itemsPerPage = is(String)(first)
		? Number(first)
		: options?.defaultPageSize
			? options.defaultPageSize
			: Pagination.DEFAULT_PAGE_SIZE
	if (after) {
		return Pagination.forward(itemsPerPage, after)
	}
	if (before) {
		return Pagination.backward(itemsPerPage, before)
	}
	return Pagination.forward(itemsPerPage)
}
