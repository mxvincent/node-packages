import { ComparisonFilter } from '../filter/filters'
import { Pagination } from '../pagination/pagination'
import { Sort } from '../sort/sort'

export class ListQueryParameter<Key extends string = string> {
	pagination: Pagination
	sorts: Sort<Key>[]
	filters: ComparisonFilter<Key>[]

	constructor(options: { pagination: Pagination; sorts?: Sort<Key>[]; filters?: ComparisonFilter<Key>[] }) {
		this.pagination = options.pagination
		this.sorts = options.sorts ?? []
		this.filters = options.filters ?? []
	}
}
