export type PageCursors = {
	startCursor: string | null
	endCursor: string | null
}

export type PageInfo = PageCursors & {
	hasPrevPage: boolean
	hasNextPage: boolean
}

export type Page<T> = {
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
