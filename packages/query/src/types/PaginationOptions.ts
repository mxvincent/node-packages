export type ForwardPagination = {
	type: 'forward'
	size: number
	after?: string
}

export type BackwardPagination = {
	type: 'backward'
	size: number
	before: string
}

export type PaginationOptions = ForwardPagination | BackwardPagination
