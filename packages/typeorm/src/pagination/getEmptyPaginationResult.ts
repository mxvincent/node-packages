import { PaginationResult } from '@mxvincent/query'

export const getEmptyPaginationResult = <T>(): PaginationResult<T> => ({
	data: [] as T[],
	totalCount: 0,
	hasPrevPage: false,
	hasNextPage: false,
	startCursor: null,
	endCursor: null
})
