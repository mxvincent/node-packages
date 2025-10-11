import { Pagination } from '@mxvincent/query-params'
import { is } from 'ramda'
import { QueryStringRecord } from '../types/QueryStringRecord'

type PaginationParameter = 'after' | 'before' | 'first'

const normalizePaginationParameters = (
	queryStringRecord: QueryStringRecord
): Record<PaginationParameter, string | null> => {
	const normalizeValue = (key: PaginationParameter) => {
		const value = queryStringRecord[key]
		return is(Array, value) ? value[0] : (value ?? null)
	}
	return {
		after: normalizeValue('after'),
		before: normalizeValue('before'),
		first: normalizeValue('first')
	}
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
