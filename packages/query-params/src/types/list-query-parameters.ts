import { KeyOf } from '@mxvincent/core/dist'
import { ComparisonFilter } from '../filter/filters'
import { Pagination } from '../pagination/pagination'
import { Sort } from '../sort/sort'

export class ListQueryParameter<T extends object = object> {
	pagination: Pagination
	sorts: Sort<KeyOf<T>>[]
	filters: ComparisonFilter<KeyOf<T>>[]

	constructor(options: { pagination: Pagination; sorts?: Sort<KeyOf<T>>[]; filters?: ComparisonFilter<KeyOf<T>>[] }) {
		this.pagination = options.pagination
		this.sorts = options.sorts ?? []
		this.filters = options.filters ?? []
	}
}
