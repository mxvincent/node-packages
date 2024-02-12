import { Sort, SortDirection } from '@mxvincent/query-params'
import { is } from 'ramda'
import { QueryStringRecord } from '../types/QueryStringRecord'

/**
 * Entityct sort params from parsed query string
 */
export const parseSorts = ({ sort }: QueryStringRecord, getFirstOnly?: boolean): Sort[] => {
	const sortParams: Required<Sort>[] = []
	const addSortParam = (str: string) => {
		const matches = str.match(/^(?<direction>asc|desc)?\(?(?<path>[a-zA-Z0-9-_.]+)\)?$/)
		if (matches) {
			const path = matches.groups?.path as string
			if (sortParams.findIndex((el) => el.path === path) === -1) {
				sortParams.push({ path, direction: (matches.groups?.direction ?? 'asc') as SortDirection })
			}
		}
	}
	if (is(String, sort)) {
		addSortParam(sort)
	} else if (is(Array, sort)) {
		for (const str of sort.filter(is(String))) {
			addSortParam(str)
			if (getFirstOnly) break
		}
	}
	return sortParams
}
