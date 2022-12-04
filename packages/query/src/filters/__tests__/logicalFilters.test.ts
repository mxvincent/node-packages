import { And, Equal, NotEqual, Or } from '../index'

test('should return `and` filter', async () => {
	expect(And(Equal('a', 'b'), NotEqual('c', 'd'))).toEqual({
		type: 'logical',
		operator: 'and',
		filters: [
			{
				type: 'comparison',
				operator: 'eq',
				path: 'a',
				value: 'b'
			},
			{
				type: 'comparison',
				operator: 'neq',
				path: 'c',
				value: 'd'
			}
		]
	})
})

test('should return `or` filter', async () => {
	expect(Or(Equal('a', 'b'), NotEqual('c', 'd'))).toEqual({
		type: 'logical',
		operator: 'or',
		filters: [
			{
				type: 'comparison',
				operator: 'eq',
				path: 'a',
				value: 'b'
			},
			{
				type: 'comparison',
				operator: 'neq',
				path: 'c',
				value: 'd'
			}
		]
	})
})
