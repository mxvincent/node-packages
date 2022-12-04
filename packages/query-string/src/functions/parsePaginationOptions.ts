import { isArray } from '@mxvincent/core'
import { PaginationOptions } from '@mxvincent/query'
import { QueryStringRecord } from '../types/QueryStringRecord'

const normalizePaginationParameters = (queryStringRecord: QueryStringRecord): Record<string, string> => {
	return ['after', 'before', 'size'].reduce((normalizedRecord, key) => {
		const value = queryStringRecord[key]
		return value ? Object.assign(normalizedRecord, { [key]: isArray(value) ? value[0] : value }) : normalizedRecord
	}, {})
}

export type ParsePaginationOptions = {
	defaultSize: number
}
export const parsePaginationOptions = (
	queryStringRecord: QueryStringRecord,
	options: ParsePaginationOptions
): PaginationOptions => {
	const { after, before, size: sizeValue } = normalizePaginationParameters(queryStringRecord)
	const size = sizeValue ? parseInt(sizeValue, 10) : options.defaultSize
	if (after) {
		return { type: 'forward', after, size }
	}
	if (before) {
		return { type: 'backward', before, size }
	}
	return { type: 'forward', size }
}
