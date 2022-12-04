import {
	CaseInsensitiveMatch,
	Equal,
	GreaterThan,
	GreaterThanOrEqual,
	In,
	LessThan,
	LessThanOrEqual,
	Like,
	Match,
	NotEqual,
	NotIn, NotLike,
	Null,
	Regex
} from '../index'

test('should return `eq` filter', async () => {
	expect(Equal('my.path', 'my-value')).toEqual({
		type: 'comparison',
		operator: 'eq',
		path: 'my.path',
		value: 'my-value'
	})
})

test('should return `neq` filter', async () => {
	expect(NotEqual('my.path', 'my-value')).toEqual({
		type: 'comparison',
		operator: 'neq',
		path: 'my.path',
		value: 'my-value'
	})
})

test('should return `gt` filter', async () => {
	expect(GreaterThan('my.path', 'my-value')).toEqual({
		type: 'comparison',
		operator: 'gt',
		path: 'my.path',
		value: 'my-value'
	})
})

test('should return `gte` filter', async () => {
	expect(GreaterThanOrEqual('my.path', 'my-value')).toEqual({
		type: 'comparison',
		operator: 'gte',
		path: 'my.path',
		value: 'my-value'
	})
})

test('should return `lt` filter', async () => {
	expect(LessThan('my.path', 'my-value')).toEqual({
		type: 'comparison',
		operator: 'lt',
		path: 'my.path',
		value: 'my-value'
	})
})

test('should return `lte` filter', async () => {
	expect(LessThanOrEqual('my.path', 'my-value')).toEqual({
		type: 'comparison',
		operator: 'lte',
		path: 'my.path',
		value: 'my-value'
	})
})

test('should return `like` filter', async () => {
	expect(Like('my.path', 'my-value')).toEqual({
		type: 'comparison',
		operator: 'like',
		path: 'my.path',
		value: 'my-value'
	})
})

test('should return `nlike` filter', async () => {
	expect(NotLike('my.path', 'my-value')).toEqual({
		type: 'comparison',
		operator: 'nlike',
		path: 'my.path',
		value: 'my-value'
	})
})

test('should return `regex` filter', async () => {
	expect(Regex('my.path', 'my-value')).toEqual({
		type: 'comparison',
		operator: 'regex',
		path: 'my.path',
		value: 'my-value'
	})
})

test('should return `in` filter', async () => {
	expect(In('my.path', ['a', 'b', 'c'])).toEqual({
		type: 'comparison',
		operator: 'in',
		path: 'my.path',
		value: ['a', 'b', 'c']
	})
})

test('should return `nin` filter', async () => {
	expect(NotIn('my.path', ['a', 'b', 'c'])).toEqual({
		type: 'comparison',
		operator: 'nin',
		path: 'my.path',
		value: ['a', 'b', 'c']
	})
})

test('should return `match` filter', async () => {
	expect(Match('my.path', 'abc')).toEqual({
		type: 'comparison',
		operator: 'match',
		path: 'my.path',
		value: 'abc'
	})
})

test('should return `null` filter', async () => {
	expect(Null('my.path')).toEqual({
		type: 'comparison',
		operator: 'null',
		path: 'my.path',
		value: null
	})
})

test('should return `imatch` filter', async () => {
	expect(CaseInsensitiveMatch('my.path', 'abc')).toEqual({
		type: 'comparison',
		operator: 'imatch',
		path: 'my.path',
		value: 'abc'
	})
})
