import { SortDirection } from '@mxvincent/query'

export interface TypeormSortOptions {
	paths: Array<string>
	direction: SortDirection
}
