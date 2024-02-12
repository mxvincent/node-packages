export enum SortDirection {
	ascending = 'ascending',
	descending = 'descending'
}

export class Sort<T extends string = string> {
	readonly direction: SortDirection
	readonly path: T

	static ascending<T extends string = string>(path: T): Sort<T> {
		return new Sort(path, SortDirection.ascending)
	}

	static descending<T extends string = string>(path: T): Sort<T> {
		return new Sort<T>(path, SortDirection.descending)
	}

	constructor(path: T, direction: SortDirection) {
		this.path = path
		this.direction = direction
	}
}
