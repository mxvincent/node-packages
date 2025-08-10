export enum PaginationDirection {
	BACKWARD = 'BACKWARD',
	FORWARD = 'FORWARD'
}

export class Pagination {
	static DEFAULT_PAGE_SIZE = 10

	readonly direction: PaginationDirection
	readonly size: number
	readonly cursor?: string
	isCountRequested = true

	static backward(size: number, before: string) {
		return new Pagination(PaginationDirection.BACKWARD, size, before)
	}

	static forward(size: number, after?: string) {
		return new Pagination(PaginationDirection.FORWARD, size, after)
	}

	private constructor(direction: PaginationDirection, size: number, cursor?: string) {
		this.direction = direction
		this.size = size
		this.cursor = cursor
	}

	get isBackward() {
		return this.direction === PaginationDirection.BACKWARD
	}

	get isForward() {
		return this.direction === PaginationDirection.FORWARD
	}
}
