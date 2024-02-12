import { Pagination } from '@mxvincent/query-params'
import { is } from 'ramda'
import { QueryParameterParserOptions } from '../types/QueryParameterParserOptions'
import { QueryStringRecord } from '../types/QueryStringRecord'

const normalizePaginationParameters = (queryStringRecord: QueryStringRecord): Record<string, string> => {
	return ['after', 'before', 'first'].reduce((normalizedRecord, key) => {
		const value = queryStringRecord[key]
		return value ? Object.assign(normalizedRecord, { [key]: is(Array, value) ? value[0] : value }) : normalizedRecord
	}, {})
}

export type ParsePagination = Pick<QueryParameterParserOptions, 'defaultPageSize'>
export const parsePaginationOptions = (queryStringRecord: QueryStringRecord, options?: ParsePagination): Pagination => {
	const { after, before, first: firstInput } = normalizePaginationParameters(queryStringRecord)
	const first = is(String)(firstInput)
		? parseInt(firstInput, 10)
		: options?.defaultPageSize
		? options.defaultPageSize
		: Pagination.defaultPageSize
	if (after) {
		return Pagination.forward(first, after)
	}
	if (before) {
		return Pagination.backward(first, before)
	}
	return Pagination.forward(first)
}
