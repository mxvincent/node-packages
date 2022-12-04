import {
	CaseInsensitiveMatch,
	ComparisonFilter,
	Equal,
	GreaterThan,
	GreaterThanOrEqual,
	In,
	LessThan,
	LessThanOrEqual,
	Like,
	Match,
	NotEqual,
	NotIn,
	NotLike,
	Null,
	Or
} from '@mxvincent/query'
import { database, User } from '../@jest/database'
import { applyFilters } from './applyFilters'

jest.mock('../functions/generateParameterName')

beforeAll(async () => database.initialize())
afterAll(async () => database.destroy())

describe('apply comparison operator to a query', () => {
	test.each<{ filter: ComparisonFilter; output: string }>([
		{ filter: Equal('key', 'value'), output: 'user.key = :parameter' },
		{ filter: NotEqual('key', 'value'), output: 'user.key <> :parameter' },
		{ filter: LessThan('key', 'value'), output: 'user.key < :parameter' },
		{ filter: LessThanOrEqual('key', 'value'), output: 'user.key <= :parameter' },
		{ filter: GreaterThan('key', 'value'), output: 'user.key > :parameter' },
		{ filter: GreaterThanOrEqual('key', 'value'), output: 'user.key >= :parameter' },
		{ filter: Like('key', 'value'), output: 'CAST(user.key as TEXT) LIKE :parameter' },
		{ filter: NotLike('key', 'value'), output: 'CAST(user.key as TEXT) NOT LIKE :parameter' },
		{ filter: In('key', ['value']), output: 'user.key IN (:...parameter)' },
		{ filter: NotIn('key', ['value']), output: 'user.key NOT IN (:...parameter)' },
		{ filter: Match('key', 'value'), output: 'CAST(user.key as TEXT) ~ :parameter' },
		{ filter: CaseInsensitiveMatch('key', 'value'), output: 'CAST(user.key as TEXT) ~* :parameter' },
		{ filter: Null('key'), output: 'user.key IS NULL' }
	])('operator: $filter.operator', ({ filter, output }) => {
		const queryBuilder = database.createQueryBuilder(User, 'user').select('id')
		const queryStringBase = queryBuilder.getQuery()
		applyFilters(queryBuilder, [filter])
		expect(queryBuilder.getQuery()).toEqual(`${queryStringBase} WHERE ${output}`)
	})
})

test('should add many comparison string to a query', async () => {
	const queryBuilder = database.createQueryBuilder(User, 'user').select('id')
	const queryStringBase = queryBuilder.getQuery()
	applyFilters(queryBuilder, [Equal('a', 'value'), Equal('b', 'value')])
	expect(queryBuilder.getQuery()).toEqual(`${queryStringBase} WHERE user.a = :parameter AND user.b = :parameter`)
})

test('should apply `or` filter at root', async () => {
	const queryBuilder = database.createQueryBuilder(User, 'user').select('id')
	const queryStringBase = queryBuilder.getQuery()
	applyFilters(queryBuilder, [Or(Equal('a', 'value'), Equal('b', 'value'))])
	expect(queryBuilder.getQuery()).toEqual(`${queryStringBase} WHERE (user.a = :parameter OR user.b = :parameter)`)
})

test('should apply nested logical', async () => {
	const queryBuilder = database.createQueryBuilder(User, 'user').select('id')
	const queryStringBase = queryBuilder.getQuery()
	applyFilters(queryBuilder, [Or(Equal('a', 'value'), Equal('b', 'value')), Equal('c', 'value')])
	expect(queryBuilder.getQuery()).toEqual(
		`${queryStringBase} WHERE (user.a = :parameter OR user.b = :parameter) AND user.c = :parameter`
	)
})
