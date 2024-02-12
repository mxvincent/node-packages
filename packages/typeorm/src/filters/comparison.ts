import { ComparisonFilter, ComparisonOperator } from '@mxvincent/query-params'

type ComparisonStringFactoryOptions = { path: string; parameterName: string }
const factories = new Map<ComparisonOperator, (options: ComparisonStringFactoryOptions) => string>()

/**
 * Register default comparison string factories
 */
factories.set('equal', ({ path, parameterName }) => {
	return `${path} = :${parameterName}`
})
factories.set('notEqual', ({ path, parameterName }) => {
	return `${path} <> :${parameterName}`
})
factories.set('greaterThan', ({ path, parameterName }) => {
	return `${path} > :${parameterName}`
})
factories.set('greaterThanOrEqual', ({ path, parameterName }) => {
	return `${path} >= :${parameterName}`
})
factories.set('lessThan', ({ path, parameterName }) => {
	return `${path} < :${parameterName}`
})
factories.set('lessThanOrEqual', ({ path, parameterName }) => {
	return `${path} <= :${parameterName}`
})
factories.set('like', ({ path, parameterName }) => {
	return `CAST(${path} as TEXT) LIKE :${parameterName}`
})
factories.set('notLike', ({ path, parameterName }) => {
	return `CAST(${path} as TEXT) NOT LIKE :${parameterName}`
})
factories.set('match', ({ path, parameterName }) => {
	return `CAST(${path} as TEXT) ~ :${parameterName}`
})
factories.set('insensitiveMatch', ({ path, parameterName }) => {
	return `CAST(${path} as TEXT) ~* :${parameterName}`
})
factories.set('in', ({ path, parameterName }) => {
	return `${path} IN (:...${parameterName})`
})
factories.set('notIn', ({ path, parameterName }) => {
	return `${path} NOT IN (:...${parameterName})`
})
factories.set('null', ({ path }) => {
	return `${path} IS NULL`
})
factories.set('notNull', ({ path }) => {
	return `${path} IS NOT NULL`
})

/**
 * Register comparison string builder for an operator
 * @param operator - comparison operator
 * @param comparator - function used to generate a comparison factory
 * @example
 * registerComparisonStringFactory('neq', (parameterName) => `!= :${parameterName}`)
 */
export const registerComparisonStringFactory = (
	operator: ComparisonOperator,
	comparator: (options: ComparisonStringFactoryOptions) => string
): void => {
	factories.set(operator, comparator)
}

/**
 * Use registered factory to generate comparison string
 */
export const getComparisonString = ({
	filter: { path, operator },
	parameterName
}: {
	filter: ComparisonFilter
	parameterName: string
	queryAlias?: string
}): string => {
	const comparator = factories.get(operator)
	if (comparator) {
		return comparator({ path, parameterName })
	}
	throw new Error(`${operator} has not registered comparison string factory`)
}
