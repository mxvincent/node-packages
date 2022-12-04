export const valueOperators = [
	'eq',
	'neq',
	'lt',
	'lte',
	'gt',
	'gte',
	'like',
	'nlike',
	'regex',
	'match',
	'imatch',
	'null'
] as const
export type ValueOperator = typeof valueOperators[number]

export const arrayOperators = ['in', 'nin'] as const
export type ArrayOperator = typeof arrayOperators[number]

export const comparisonOperators = [...valueOperators, ...arrayOperators]
export type ComparisonOperator = ValueOperator | ArrayOperator
