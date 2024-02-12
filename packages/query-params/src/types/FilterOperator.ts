export const logicalOperators = ['and', 'or'] as const
export type LogicalOperator = (typeof logicalOperators)[number]

export const arrayComparisonOperators = ['in', 'notIn'] as const
export type ArrayComparisonOperator = (typeof arrayComparisonOperators)[number]

export const nullComparisonOperators = ['null', 'notNull'] as const
export type NullComparisonOperator = (typeof nullComparisonOperators)[number]

export const valueComparisonOperators = [
	'equal',
	'notEqual',
	'lessThan',
	'lessThanOrEqual',
	'greaterThan',
	'greaterThanOrEqual',
	'like',
	'notLike',
	'match',
	'insensitiveMatch'
] as const
export type ValueComparisonOperator = (typeof valueComparisonOperators)[number]

export const comparisonOperators = [
	...arrayComparisonOperators,
	...nullComparisonOperators,
	...valueComparisonOperators
] as const
export type ComparisonOperator = (typeof comparisonOperators)[number]

export type FilterOperator = ComparisonOperator | LogicalOperator
