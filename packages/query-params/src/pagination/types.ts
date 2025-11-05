export interface PageInfo {
	pageSize: number
	itemsCount: number
	cursor: string | null
	hasNextPage: boolean
}

export interface PageEdge<T> {
	cursor: string
	node: T
}

export interface Page<T> {
	edges: PageEdge<T>[]
	pageInfo: PageInfo
	totalCount: number | null
}
