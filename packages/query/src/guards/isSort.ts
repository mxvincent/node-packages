import { isString } from '@mxvincent/core'
import { is } from 'ramda'
import { Sort } from '../types/Sort'

/**
 * SortParams type guard
 */
export const isSort = (value: unknown): value is Sort => {
	return is(Object, value) && isString(typeof value.direction) && isString(typeof value.path)
}
