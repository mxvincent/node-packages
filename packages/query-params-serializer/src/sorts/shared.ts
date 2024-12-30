import { reverseRecord } from '@mxvincent/core'
import { SortDirection } from '@mxvincent/query-params'

export const SORT_DIRECTION_ENCODING_MAP: Record<SortDirection, string> = {
	[SortDirection.ASC]: 'asc',
	[SortDirection.DESC]: 'desc'
} as const

export const encodeSortDirection = (decoded: SortDirection): string => {
	return SORT_DIRECTION_ENCODING_MAP[decoded]
}

export const SORT_DIRECTION_DECODING_MAP = reverseRecord(SORT_DIRECTION_ENCODING_MAP)

export const decodeSortDirection = (encoded: string): SortDirection => {
	return SORT_DIRECTION_DECODING_MAP[encoded]
}
