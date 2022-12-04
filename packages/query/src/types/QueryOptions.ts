import { Filter } from './Filter'
import { PaginationOptions } from './PaginationOptions'
import { Sort } from './Sort'

export type QueryOptions = {
	pagination: PaginationOptions | null
	sorts: Sort[]
	filters: Filter[]
}
