import { ComparisonFilter } from '@mxvincent/query'

type ComparisonStringFactoryOptions = { path: string; parameterName: string }
const factories = new Map<string, (options: ComparisonStringFactoryOptions) => string>()

/**
 * Register default comparison string factories
 */
factories.set('eq', ({ path, parameterName }) => `${path} = :${parameterName}`)
factories.set('neq', ({ path, parameterName }) => `${path} <> :${parameterName}`)
factories.set('gt', ({ path, parameterName }) => `${path} > :${parameterName}`)
factories.set('gte', ({ path, parameterName }) => `${path} >= :${parameterName}`)
factories.set('lt', ({ path, parameterName }) => `${path} < :${parameterName}`)
factories.set('lte', ({ path, parameterName }) => `${path} <= :${parameterName}`)
factories.set('like', ({ path, parameterName }) => `CAST(${path} as TEXT) LIKE :${parameterName}`)
factories.set('nlike', ({ path, parameterName }) => `CAST(${path} as TEXT) NOT LIKE :${parameterName}`)
factories.set('in', ({ path, parameterName }) => `${path} IN (:...${parameterName})`)
factories.set('nin', ({ path, parameterName }) => `${path} NOT IN (:...${parameterName})`)
factories.set('match', ({ path, parameterName }) => `CAST(${path} as TEXT) ~ :${parameterName}`)
factories.set('imatch', ({ path, parameterName }) => `CAST(${path} as TEXT) ~* :${parameterName}`)
factories.set('null', ({ path }) => `${path} IS NULL`)

/**
 * Register comparison string builder for an operator
 * @param operator - comparison operator
 * @param comparator - function used to generate a comparison factory
 * @example
 * registerComparisonStringFactory('neq', (parameterName) => `!= :${parameterName}`)
 */
export const registerComparisonStringFactory = (
	operator: string,
	comparator: (options: ComparisonStringFactoryOptions) => string
): void => {
	factories.set(operator, comparator)
}

/**
 * Use registered factory to generate comparison string
 * @param operator - filter operator
 * @param path - filter path
 * @param parameterName - query parameter name
 * @throws <Error> Error is thrown when comparison string factory is not registered
 */
export const getComparisonString = ({
	filter: { operator, path },
	parameterName
}: {
	filter: ComparisonFilter
	parameterName: string
}): string => {
	const comparator = factories.get(operator)
	if (!comparator) {
		throw new Error(`${operator} has not registered comparison string factory`)
	}
	return comparator({ path, parameterName })
}
