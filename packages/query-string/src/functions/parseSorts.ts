import { isArray, isString } from '@mxvincent/core'
import { Sort, SortDirection } from '@mxvincent/query'
import { QueryStringRecord } from '../types/QueryStringRecord'

/**
 * Extract sort params from parsed query string
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
	if (isString(sort)) {
		addSortParam(sort)
	} else if (isArray<string>(sort)) {
		for (const str of sort.filter(isString)) {
			addSortParam(str)
			if (getFirstOnly) break
		}
	}
	return sortParams
}
