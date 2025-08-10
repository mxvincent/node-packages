import { is } from 'ramda'
import { Sort, SORT_DIRECTIONS } from './sort'

/**
 * SortParams type guard
 */
export const isSort = (value: unknown): value is Sort => {
	return is(Object, value) && SORT_DIRECTIONS.includes(value.direction) && typeof value.path === 'string'
}
