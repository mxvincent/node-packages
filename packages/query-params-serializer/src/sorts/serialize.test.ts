import { Sort } from '@mxvincent/query-params'
import { serializeSort, serializeSorts } from './serialize'

describe('should serialize sort', () => {
	test.each([
		{
			sort: Sort.asc('id'),
			output: 'asc(id)'
		},
		{
			sort: Sort.desc('id'),
			output: 'desc(id)'
		}
	])('$output', async ({ sort, output }) => {
		expect(serializeSort(sort)).toStrictEqual(output)
	})
})

test('should serialize many sorts', async () => {
	expect(serializeSorts([Sort.desc('createdAt'), Sort.asc('id')])).toEqual(['desc(createdAt)', 'asc(id)'])
})
