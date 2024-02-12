import { Sort } from '@mxvincent/query-params'
import { serializeSort, serializeSorts } from './serializeSort'

describe('should serialize sort', () => {
	test.each([
		{
			sort: Sort.ascending('id'),
			output: 'ascending(id)'
		},
		{
			sort: Sort.descending('id'),
			output: 'descending(id)'
		}
	])('$output', async ({ sort, output }) => {
		expect(serializeSort(sort)).toStrictEqual(output)
	})
})

test('should serialize many sorts', async () => {
	expect(serializeSorts([Sort.descending('createdAt'), Sort.ascending('id')])).toEqual([
		'descending(createdAt)',
		'ascending(id)'
	])
})
