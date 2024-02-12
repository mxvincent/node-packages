export type PaginationType = 'backward' | 'forward'

let defaultPageSize = 10

export class Pagination {
	readonly type: PaginationType
	readonly first: number
	readonly cursor?: string
	isCountRequested = true

	static get defaultPageSize() {
		return defaultPageSize
	}

	static set defaultPageSize(value: number) {
		defaultPageSize = value
	}

	static backward(first: number, before: string) {
		return new Pagination('backward', first, before)
	}

	static forward(first: number, after?: string) {
		return new Pagination('forward', first, after)
	}

	constructor(type: PaginationType, first: number, cursor?: string) {
		this.type = type
		this.first = first
		this.cursor = cursor
	}
}
