import { And, Equal, In, Null, Or } from '@mxvincent/query-params'
import { serializeFilter } from './serializeFilter'

const encode = jest.fn(encodeURIComponent)

beforeEach(async () => {
	encode.mockClear()
})

describe('should encode filter values', () => {
	test.each([
		{
			filter: Null('a'),
			output: 'null(a)',
			shouldCallEncodeTimes: 0
		},
		{
			filter: Equal('a', 'va,l'),
			output: 'equal(a,va%2Cl)',
			shouldCallEncodeTimes: 1
		},
		{
			filter: In('a', ['val', 'va,l']),
			output: 'in(a,val,va%2Cl)',
			shouldCallEncodeTimes: 2
		},
		{
			filter: And(Equal('a', 'va,l'), In('a', ['val', 'va,l'])),
			output: 'and(equal(a,va%2Cl),in(a,val,va%2Cl))',
			shouldCallEncodeTimes: 3
		}
	])('$output', async ({ filter, output, shouldCallEncodeTimes }) => {
		expect(serializeFilter(filter, encode)).toStrictEqual(output)
		expect(encode).toHaveBeenCalledTimes(shouldCallEncodeTimes)
	})
})

describe('should serialize logical filters', () => {
	test.each([
		{
			filter: And(Equal('a', 'a')),
			output: 'and(equal(a,a))'
		},
		{
			filter: And(Equal('a', 'a'), Equal('b', 'b')),
			output: 'and(equal(a,a),equal(b,b))'
		},
		{
			filter: Or(And(Equal('a', 'a'), Equal('b', 'b')), And(Equal('a', 'a'), Equal('c', 'c'))),
			output: 'or(and(equal(a,a),equal(b,b)),and(equal(a,a),equal(c,c)))'
		}
	])('$output', async ({ filter, output }) => {
		expect(serializeFilter(filter, encode)).toStrictEqual(output)
	})
})
