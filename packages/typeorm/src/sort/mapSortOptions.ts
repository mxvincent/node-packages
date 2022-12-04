import { Optional } from '@mxvincent/core'
import { Sort } from '@mxvincent/query'
import { TypeormSortOptions } from '../index'

/**
 * Get typeorm sort options from query sort options
 */
export const mapSortOptions = (sort?: Sort): Optional<TypeormSortOptions> => {
	if (!sort) {
		return
	}
	return { direction: sort.direction, paths: [sort.path] }
}
