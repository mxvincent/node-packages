import { GQLConnection, GQLEdge, Page } from '../types/Page'

export const createEmptyConnection = <T>(): GQLConnection<T> => ({
	edges: [] as GQLEdge<T>[],
	totalCount: 0,
	pageInfo: {
		hasPrevPage: false,
		hasNextPage: false,
		startCursor: null,
		endCursor: null
	}
})

export const createEmptyPage = <T>(): Page<T> => ({
	data: [] as T[],
	totalCount: 0,
	pageInfo: {
		hasPrevPage: false,
		hasNextPage: false,
		startCursor: null,
		endCursor: null
	}
})
