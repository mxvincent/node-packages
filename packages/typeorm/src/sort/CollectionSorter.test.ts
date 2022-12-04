import { Sort } from '@mxvincent/query'
import { sortArrayWith } from '../@jest'
import { database, factories, Post } from '../@jest/database'
import { Author } from '../@jest/database/entities/Author'
import { CollectionSorter } from './CollectionSorter'

beforeAll(async () => {
	await database.initialize()
})

afterAll(async () => {
	await database.destroy()
})

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
			{ direction: 'asc', path: 'createdAt' },
			{ direction: 'asc', path: 'id' }
		]
		const expected = sortArrayWith<Author>(sorts, collection)
		const sorter = new CollectionSorter(Author, { sorts })
		const query = database.manager.createQueryBuilder(Author, 'author')
		expect(await sorter.getSortedCollection(query)).toEqual(expected)
	})

	test('(desc) should return sorted data', async () => {
		const sorts: Sort<keyof Author>[] = [
			{ direction: 'desc', path: 'createdAt' },
			{ direction: 'desc', path: 'id' }
		]
		const expected = sortArrayWith<Author>(sorts, collection)
		const sorter = new CollectionSorter(Author, { sorts })
		const query = database.manager.createQueryBuilder(Author, 'author')
		expect(await sorter.getSortedCollection(query)).toEqual(expected)
	})
})

test.skip('should sort on field containing null values', async () => {
	await database.manager.save(['a', 'd', null, 'c', 'f', 'b', 'e', null].map((name) => new Post({ name })))
	const sorter = new CollectionSorter(Author, {
		sorts: [{ path: 'name', direction: 'asc' }]
	})
	const result = await sorter.getSortedCollection(database.manager.createQueryBuilder(Author, 'author'))
	expect(result.map((el) => el.name)).toBe(['a', 'b', 'c', 'd', 'e', 'f', null, null])
})

test('should sort on nested values', async () => {
	await database.manager.save(
		new Author({
			name: 'author-0',
			createdAt: new Date('2022-01-01T00:00:00Z'),
			posts: [
				new Post({ name: 'post-1' }),
				new Post({ name: 'post-0' }),
				new Post({ name: 'post-3' }),
				new Post({ name: 'post-2' })
			]
		})
	)

	const sorter = new CollectionSorter(Author, {
		sorts: [
			{ path: 'name', direction: 'asc' },
			{ path: 'posts.name', direction: 'asc' }
		]
	})
	const [result] = await sorter.getSortedCollection(
		database.createQueryBuilder(Author, 'author').leftJoinAndSelect('author.posts', 'posts')
	)
	expect(result.posts[0]).toHaveProperty('name', 'post-0')
	expect(result.posts[1]).toHaveProperty('name', 'post-1')
	expect(result.posts[2]).toHaveProperty('name', 'post-2')
	expect(result.posts[3]).toHaveProperty('name', 'post-3')
})
