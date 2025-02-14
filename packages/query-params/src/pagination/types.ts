export interface PageCursors {
	startCursor: string | null
	endCursor: string | null
}

export interface PageInfo extends PageCursors {
	hasPrevPage: boolean
	hasNextPage: boolean
}

export interface Page<T> {
	data: T[]
	totalCount: number | null
	pageInfo: PageInfo
}

export interface GQLEdge<T> {
	cursor: string | null
	node: T
}

export interface GQLConnection<T> {
	edges: GQLEdge<T>[]
	pageInfo: PageInfo
	totalCount: number | null
}
