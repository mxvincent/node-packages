import { ArrayComparisonFilter, LogicalFilter, NullComparisonFilter, ValueComparisonFilter } from '../types/Filter'
import {
	And,
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
} from './factories'

describe('ArrayComparisonFilter', () => {
	test('should return `In` filter', () => {
		expect(In('my.path', ['a', 'b', 'c'])).toStrictEqual(new ArrayComparisonFilter('in', 'my.path', ['a', 'b', 'c']))
	})

	test('should return `NotIn` filter', () => {
		expect(NotIn('my.path', ['a', 'b', 'c'])).toStrictEqual(
			new ArrayComparisonFilter('notIn', 'my.path', ['a', 'b', 'c'])
		)
	})
})

describe('NullComparisonFilter', () => {
	test('should return `Null` filter', () => {
		expect(Null('my.path')).toStrictEqual(new NullComparisonFilter('null', 'my.path'))
	})

	test('should return `NotNull` filter', () => {
		expect(NotNull('my.path')).toStrictEqual(new NullComparisonFilter('notNull', 'my.path'))
	})
})

describe('ValueComparisonFilter', () => {
	test('should return `Equal` filter', () => {
		expect(Equal('my.path', 'abc')).toStrictEqual(new ValueComparisonFilter('equal', 'my.path', 'abc'))
	})

	test('should return `NotEqual` filter', () => {
		expect(NotEqual('my.path', 'abc')).toStrictEqual(new ValueComparisonFilter('notEqual', 'my.path', 'abc'))
	})

	test('should return `GreaterThan` filter', () => {
		expect(GreaterThan('my.path', 'abc')).toStrictEqual(new ValueComparisonFilter('greaterThan', 'my.path', 'abc'))
	})

	test('should return `GreaterThanOrEqual` filter', () => {
		expect(GreaterThanOrEqual('my.path', 'abc')).toStrictEqual(
			new ValueComparisonFilter('greaterThanOrEqual', 'my.path', 'abc')
		)
	})

	test('should return `LessThan` filter', () => {
		expect(LessThan('my.path', 'abc')).toStrictEqual(new ValueComparisonFilter('lessThan', 'my.path', 'abc'))
	})

	test('should return `LessThanOrEqual` filter', () => {
		expect(LessThanOrEqual('my.path', 'abc')).toStrictEqual(
			new ValueComparisonFilter('lessThanOrEqual', 'my.path', 'abc')
		)
	})

	test('should return `Like` filter', () => {
		expect(Like('my.path', 'abc')).toStrictEqual(new ValueComparisonFilter('like', 'my.path', 'abc'))
	})

	test('should return `NotLike` filter', () => {
		expect(NotLike('my.path', 'abc')).toStrictEqual(new ValueComparisonFilter('notLike', 'my.path', 'abc'))
	})

	test('should return `Match` filter', () => {
		expect(Match('my.path', 'abc')).toStrictEqual(new ValueComparisonFilter('match', 'my.path', 'abc'))
	})

	test('should return `InsensitiveMatch` filter', () => {
		expect(InsensitiveMatch('my.path', 'abc')).toStrictEqual(
			new ValueComparisonFilter('insensitiveMatch', 'my.path', 'abc')
		)
	})
})

describe('LogicalFilter', () => {
	test('should return `and` filter', () => {
		expect(And(Equal('a', 'b'), NotEqual('c', 'd'))).toStrictEqual(
			new LogicalFilter('and', [Equal('a', 'b'), NotEqual('c', 'd')])
		)
	})

	test('should return `or` filter', () => {
		expect(Or(Equal('a', 'b'), NotEqual('c', 'd'))).toStrictEqual(
			new LogicalFilter('or', [Equal('a', 'b'), NotEqual('c', 'd')])
		)
	})
})
