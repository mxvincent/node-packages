import { Sort, SortDirection } from '@mxvincent/query-params'
import { randomUUID } from 'node:crypto'
import { sortArrayWith } from './@jest'
import { Author, factories, Post, useTestingDatabase } from './@jest/database'
import { hydrate, hydratePartial } from './helpers/hydrate'
import { Sorter } from './Sorter'

const database = useTestingDatabase()

const totalCount = 100
describe.each([
	{ description: 'DATASET: use unique value to perform sort', collection: factories.createAuthors(totalCount) },
	{ description: 'DATASET: use duplicated values to perform sort', collection: factories.createAuthors(totalCount, 3) },
	{ description: 'DATASET: non sequential id', collection: factories.createAuthors(totalCount, 1, false) }
])('$description', ({ collection }) => {
	beforeAll(async () => {
		await database.manager.insert(Author, collection)
	})

	afterAll(async () => {
		await database.manager.delete(
			Author,
			collection.map((user) => user.id)
		)
	})

	test('(asc) should return sorted data', async () => {
		const sorts: Sort<keyof Author>[] = [
			{ direction: SortDirection.ascending, path: 'createdAt' },
			{ direction: SortDirection.ascending, path: 'id' }
		]
		const expected = sortArrayWith<Author>(sorts, collection)
		const query = database.manager.createQueryBuilder(Author, 'author')
		const sorter = new Sorter(Author, { sorts, query })
		expect(await sorter.getSortedCollection()).toEqual(expected)
	})

	test('(desc) should return sorted data', async () => {
		const sorts: Sort<keyof Author>[] = [
			{ direction: SortDirection.descending, path: 'createdAt' },
			{ direction: SortDirection.descending, path: 'id' }
		]
		const expected = sortArrayWith<Author>(sorts, collection)
		const query = database.manager.createQueryBuilder(Author, 'author')
		const sorter = new Sorter(Author, { sorts, query })
		expect(await sorter.getSortedCollection()).toEqual(expected)
	})
})

describe('should sort on field containing null values', () => {
	beforeAll(async () => {
		const author = hydrate(Author, {
			id: randomUUID(),
			name: 'author-0',
			gender: 'male',
			age: 33,
			createdAt: new Date('2022-01-01T00:00:00Z'),
			posts: []
		})
		await database.manager.save(author)
		await database.manager.save(
			['a', 'd', null, 'c', 'f', 'b', 'e', null].map((name) => hydratePartial(Post, { name, author }))
		)
	})

	afterAll(async () => {
		await database.manager.delete(Post, {})
	})

	test.each<{ direction: SortDirection; expected: unknown[] }>([
		{
			direction: SortDirection.ascending,
			expected: ['a', 'b', 'c', 'd', 'e', 'f', null, null]
		},
		{
			direction: SortDirection.descending,
			expected: [null, null, 'f', 'e', 'd', 'c', 'b', 'a']
		}
	])('($direction) should sort on field containing null values', async ({ direction, expected }) => {
		const sorter = new Sorter(Post, {
			query: database.manager.createQueryBuilder(Post, 'post'),
			sorts: [{ path: 'name', direction }]
		})
		const result = await sorter.getSortedCollection()
		expect(result.map((el) => el.name)).toEqual(expected)
	})
})

test('should sort on nested values', async () => {
	const author = hydrate(Author, {
		id: randomUUID(),
		name: 'author-0',
		gender: 'male',
		age: 33,
		createdAt: new Date('2022-01-01T00:00:00Z'),
		posts: []
	})
	const posts = [
		hydratePartial(Post, { name: 'post-1', author }),
		hydratePartial(Post, { name: 'post-0', author }),
		hydratePartial(Post, { name: 'post-3', author }),
		hydratePartial(Post, { name: 'post-2', author })
	]
	await database.manager.save([author, ...posts])

	const sorter = new Sorter(Author, {
		query: database.manager.createQueryBuilder(Author, 'author').leftJoinAndSelect('author.posts', 'posts'),
		sorts: [
			{ path: 'name', direction: SortDirection.ascending },
			{ path: 'posts.name', direction: SortDirection.ascending }
		]
	})
	const [result] = await sorter.getSortedCollection()
	for (let i = 0; i < 4; i++) {
		expect(result.posts?.at(i)?.name).toBe(`post-${i}`)
	}
})
