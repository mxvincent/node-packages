import { is, isNil } from 'ramda'
import { Sort } from '../types/Sort'

/**
 * SortParams type guard
 */
export const isSort = (value: unknown): value is Sort => {
	return !isNil(value) && is(Object, value) && is(String, value.direction) && is(String, value.path)
}
