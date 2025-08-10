import { reverseRecord } from '@mxvincent/core'
import { ComparisonOperator, FilterOperator, LogicalOperator } from '@mxvincent/query-params'

export const FILTER_OPERATOR_ENCODING_MAP: Record<FilterOperator, string> = {
	[LogicalOperator.AND]: 'and',
	[LogicalOperator.OR]: 'or',
	[ComparisonOperator.IN]: 'in',
	[ComparisonOperator.NOT_IN]: 'notIn',
	[ComparisonOperator.NULL]: 'null',
	[ComparisonOperator.NOT_NULL]: 'notNull',
	[ComparisonOperator.EQUAL]: 'equal',
	[ComparisonOperator.NOT_EQUAL]: 'notEqual',
	[ComparisonOperator.LESS_THAN]: 'lessThan',
	[ComparisonOperator.LESS_THAN_OR_EQUAL]: 'lessThanOrEqual',
	[ComparisonOperator.GREATER_THAN]: 'greaterThan',
	[ComparisonOperator.GREATER_THAN_OR_EQUAL]: 'greaterThanOrEqual',
	[ComparisonOperator.LIKE]: 'like',
	[ComparisonOperator.NOT_LIKE]: 'notLike',
	[ComparisonOperator.MATCH]: 'match',
	[ComparisonOperator.INSENSITIVE_MATCH]: 'insensitiveMatch'
} as const

export const encodeFilterOperator = (decoded: FilterOperator): string => {
	return FILTER_OPERATOR_ENCODING_MAP[decoded]
}

export const FILTER_OPERATOR_DECODING_MAP = reverseRecord(FILTER_OPERATOR_ENCODING_MAP)

export const decodeFilterOperator = (encoded: string): FilterOperator => {
	return FILTER_OPERATOR_DECODING_MAP[encoded]
}
