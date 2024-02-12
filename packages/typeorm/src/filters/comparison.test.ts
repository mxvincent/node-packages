import {
	ComparisonFilter,
	Equal,
	GreaterThan,
	GreaterThanOrEqual,
	In,
	InsensitiveMatch,
	LessThan,
	LessThanOrEqual,
	Like,
	Match,
	NotEqual,
	NotIn,
	NotLike,
	NotNull,
	Null
} from '@mxvincent/query-params'
import { getComparisonString } from './comparison'

jest.mock('./generateParameterName')

describe('get comparison string', () => {
	test.each<{
		filter: ComparisonFilter
		output: string
	}>([
		{ filter: Equal('key', 'value'), output: 'key = :parameter' },
		{ filter: NotEqual('key', 'value'), output: 'key <> :parameter' },
		{ filter: LessThan('key', 'value'), output: 'key < :parameter' },
		{ filter: LessThanOrEqual('key', 'value'), output: 'key <= :parameter' },
		{ filter: GreaterThan('key', 'value'), output: 'key > :parameter' },
		{ filter: GreaterThanOrEqual('key', 'value'), output: 'key >= :parameter' },
		{ filter: Like('key', 'value'), output: 'CAST(key as TEXT) LIKE :parameter' },
		{ filter: NotLike('key', 'value'), output: 'CAST(key as TEXT) NOT LIKE :parameter' },
		{ filter: In('key', ['value']), output: 'key IN (:...parameter)' },
		{ filter: NotIn('key', ['value']), output: 'key NOT IN (:...parameter)' },
		{ filter: Match('key', 'value'), output: 'CAST(key as TEXT) ~ :parameter' },
		{ filter: InsensitiveMatch('key', 'value'), output: 'CAST(key as TEXT) ~* :parameter' },
		{ filter: Null('key'), output: 'key IS NULL' },
		{ filter: NotNull('key'), output: 'key IS NOT NULL' }
	])('operator: $filter.operator', ({ filter, output }) => {
		expect(getComparisonString({ filter, parameterName: 'parameter' })).toBe(output)
	})
})
