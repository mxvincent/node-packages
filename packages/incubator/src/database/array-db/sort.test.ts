import { Sort } from '@mxvincent/query-params'
import { sortArrayWith } from './sort'

test('single sort', () => {
	const values = [
		{ a: 'a', b: 1 },
		{ a: 'b', b: 2 },
		{ a: 'b', b: 1 },
		{ a: 'c', b: 3 },
		{ a: 'b', b: 3 }
	]

	const sorted = sortArrayWith(values, [Sort.desc('a')])

	expect(sorted).toEqual([
		{ a: 'c', b: 3 },
		{ a: 'b', b: 2 },
		{ a: 'b', b: 1 },
		{ a: 'b', b: 3 },
		{ a: 'a', b: 1 }
	])
})

test('dual sort', () => {
	const values = [
		{ a: 'a', b: 1 },
		{ a: 'b', b: 2 },
		{ a: 'b', b: 1 },
		{ a: 'c', b: 3 },
		{ a: 'b', b: 3 }
	]

	const sorted = sortArrayWith(values, [Sort.asc('a'), Sort.asc('b')])

	expect(sorted).toEqual([
		{ a: 'a', b: 1 },
		{ a: 'b', b: 1 },
		{ a: 'b', b: 2 },
		{ a: 'b', b: 3 },
		{ a: 'c', b: 3 }
	])
})

test('dual sort with opposite direction', () => {
	const values = [
		{ a: 'a', b: 1 },
		{ a: 'b', b: 2 },
		{ a: 'b', b: 1 },
		{ a: 'c', b: 3 },
		{ a: 'b', b: 3 }
	]

	const sorted = sortArrayWith(values, [Sort.desc('a'), Sort.asc('b')])

	expect(sorted).toEqual([
		{ a: 'c', b: 3 },
		{ a: 'b', b: 1 },
		{ a: 'b', b: 2 },
		{ a: 'b', b: 3 },
		{ a: 'a', b: 1 }
	])
})
