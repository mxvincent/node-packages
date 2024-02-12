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
	Null,
	Or
} from '@mxvincent/query-params'
import { Author, useTestingDatabase } from '../@jest/database'
import { applyFilters } from './applyFilters'

jest.mock('./generateParameterName')

const database = useTestingDatabase()

describe('apply comparison operator to a query', () => {
	test.each<{ filter: ComparisonFilter; output: string }>([
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
		const queryBuilder = database.manager.createQueryBuilder(Author, 'author').select('id')
		const queryStringBase = queryBuilder.getQuery()
		applyFilters(queryBuilder, [filter])
		expect(queryBuilder.getQuery()).toEqual(`${queryStringBase} WHERE ${output}`)
	})
})

test('should add many comparison string to a query', async () => {
	const queryBuilder = database.manager.createQueryBuilder(Author, 'author').select('id')
	const queryStringBase = queryBuilder.getQuery()
	applyFilters(queryBuilder, [Equal('author.a', 'value'), Equal('author.b', 'value')])
	expect(queryBuilder.getQuery()).toEqual(`${queryStringBase} WHERE author.a = :parameter AND author.b = :parameter`)
})

test('should apply `or` filter at root', async () => {
	const queryBuilder = database.manager.createQueryBuilder(Author, 'author').select('id')
	const queryStringBase = queryBuilder.getQuery()
	applyFilters(queryBuilder, [Or(Equal('author.a', 'value'), Equal('author.b', 'value'))])
	expect(queryBuilder.getQuery()).toEqual(`${queryStringBase} WHERE (author.a = :parameter OR author.b = :parameter)`)
})

test('should apply nested logical', async () => {
	const queryBuilder = database.manager.createQueryBuilder(Author, 'author').select('id')
	const queryStringBase = queryBuilder.getQuery()
	applyFilters(queryBuilder, [Or(Equal('author.a', 'value'), Equal('author.b', 'value')), Equal('author.c', 'value')])
	expect(queryBuilder.getQuery()).toEqual(
		`${queryStringBase} WHERE (author.a = :parameter OR author.b = :parameter) AND author.c = :parameter`
	)
})
