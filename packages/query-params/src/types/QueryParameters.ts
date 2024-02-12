import { Filter } from './Filter'
import { Pagination } from './Pagination'
import { Sort } from './Sort'

export class QueryParameters {
	readonly pagination: Pagination
	readonly filters: Filter[]
	readonly sorts: Sort[]

	constructor(options?: Partial<QueryParameters>) {
		this.pagination = options?.pagination ?? Pagination.forward(Pagination.defaultPageSize)
		this.filters = options?.filters ?? []
		this.sorts = options?.sorts ?? []
	}
}
