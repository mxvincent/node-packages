import { Pagination, Sort, SortDirection } from '@mxvincent/query-params'
import { base64Decode, base64Encode } from '@mxvincent/utils'
import { lensProp, map, view } from 'ramda'
import { slice, sortArrayWith } from './@jest'
import { Author, DateContainer, factories, useTestingDatabase } from './@jest/database'
import { hydrate } from './helpers/hydrate'
import { Pager } from './Pager'

const mapIds = map(view(lensProp<{ id: string }>('id')))

const database = useTestingDatabase()

const usersAscSorts: Sort<keyof Author>[] = [Sort.ascending('createdAt'), Sort.ascending('id')]
const usersDescSorts: Sort<keyof Author>[] = [Sort.descending('createdAt'), Sort.ascending('id')]
const createAuthorPager = (direction: SortDirection) => {
	return new Pager(Author, {
		query: database.manager.createQueryBuilder(Author, 'author'),
		sorts: direction === SortDirection.ascending ? usersAscSorts : usersDescSorts
	})
}

describe('Pager.getPage()', () => {
	const totalCount = 50

	describe.each<{ collection: Author[]; description: string }>([
		{
			collection: factories.createAuthors(totalCount),
			description: `DATASET: sequential id's, unique createdAt`
		},
		{
			collection: factories.createAuthors(totalCount, 2),
			description: `DATASET: sequential id's, duplicated createdAt`
		},
		{
			collection: factories.createAuthors(totalCount, 3, true),
			description: `DATASET: random ids, duplicated createdAt`
		}
	])('$description', ({ collection }) => {
		const asc = sortArrayWith(usersAscSorts, collection)
		const desc = sortArrayWith(usersDescSorts, collection)

		beforeAll(() => database.manager.insert(Author, collection))
		afterAll(() => database.manager.delete(Author, mapIds(collection)))

		describe('should return n first items', () => {
			test('asc - 12345 - should return first items without cursor', async () => {
				const expected = slice(0, 10, asc)
				const pager = createAuthorPager(SortDirection.ascending)
				const result = await pager.getPage(Pagination.forward(10))
				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						startCursor: pager.encodeCursor(expected.first),
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: true,
						hasPrevPage: false
					},
					totalCount
				})
			})
			test('desc - 54321 - should return first items without cursor', async () => {
				const expected = slice(0, 10, desc)
				const pager = createAuthorPager(SortDirection.descending)
				const result = await pager.getPage(Pagination.forward(10))
				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						startCursor: pager.encodeCursor(expected.first),
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: true,
						hasPrevPage: false
					},
					totalCount
				})
			})
			test('asc - 1<|2345 - should return first items before cursor', async () => {
				const expected = slice(0, 2, asc)
				const pager = createAuthorPager(SortDirection.ascending)
				const result = await pager.getPage(Pagination.backward(10, pager.encodeCursor(asc[2])))
				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						startCursor: pager.encodeCursor(expected.first),
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: true,
						hasPrevPage: false
					},
					totalCount
				})
			})
			test('desc - 5<|4321 - should return first items before cursor', async () => {
				const expected = slice(0, 2, desc)
				const pager = createAuthorPager(SortDirection.descending)
				const result = await pager.getPage(Pagination.backward(10, pager.encodeCursor(desc[2])))
				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						startCursor: pager.encodeCursor(expected.first),
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: true,
						hasPrevPage: false
					},
					totalCount
				})
			})
		})

		describe('should return n items from the middle of the dataset', () => {
			test('asc - 12|>345 - should return n items after cursor', async () => {
				const expected = slice(20, 10, asc)
				const pager = createAuthorPager(SortDirection.ascending)
				const result = await pager.getPage(Pagination.forward(10, pager.encodeCursor(asc[19])))
				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: true,
						hasPrevPage: true,
						startCursor: pager.encodeCursor(expected.first)
					},
					totalCount
				})
				expect(result.data.length).toBe(10)
			})
			test('asc - 123<|45 - should return n items before cursor ', async () => {
				const expected = slice(20, 10, asc)
				const pager = createAuthorPager(SortDirection.ascending)
				const result = await pager.getPage(Pagination.backward(10, pager.encodeCursor(asc[30])))
				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: true,
						hasPrevPage: true,
						startCursor: pager.encodeCursor(expected.first)
					},
					totalCount
				})
				expect(result.data.length).toBe(10)
			})
			test('desc - 54|>321 - should return n items after cursor', async () => {
				const expected = slice(20, 10, desc)
				const pager = createAuthorPager(SortDirection.descending)
				const result = await pager.getPage(Pagination.forward(10, pager.encodeCursor(desc[19])))
				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						startCursor: pager.encodeCursor(expected.first),
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: true,
						hasPrevPage: true
					},
					totalCount
				})
				expect(result.data.length).toBe(10)
			})
			test('desc - 543<|21 - should return n items before cursor', async () => {
				const expected = slice(20, 10, desc)
				const pager = createAuthorPager(SortDirection.descending)
				const result = await pager.getPage(Pagination.backward(10, pager.encodeCursor(desc[30])))
				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						startCursor: pager.encodeCursor(expected.first),
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: true,
						hasPrevPage: true
					},
					totalCount
				})
				expect(result.data.length).toBe(10)
			})
		})

		describe('should return last items ', function () {
			test('asc - 1234|>5 - get n last items', async () => {
				const expected = slice(45, 10, asc)
				const pager = createAuthorPager(SortDirection.ascending)
				const result = await pager.getPage(Pagination.forward(10, pager.encodeCursor(asc[44])))
				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						startCursor: pager.encodeCursor(expected.first),
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: false,
						hasPrevPage: true
					},
					totalCount
				})
				expect(result.data.length).toBe(5)
			})
			test('desc - 5432|>1 - get n last items after', async () => {
				const expected = slice(45, 10, desc)
				const pager = createAuthorPager(SortDirection.descending)
				const result = await pager.getPage(Pagination.forward(10, pager.encodeCursor(desc[44])))
				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						startCursor: pager.encodeCursor(expected.first),
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: false,
						hasPrevPage: true
					},
					totalCount
				})
				expect(result.data.length).toBe(5)
			})
		})
	})
})

describe('Pager.getConnection()', () => {
	const collection = factories.createAuthors(20)

	beforeAll(() => database.manager.insert(Author, collection))
	afterAll(() => database.manager.delete(Author, mapIds(collection)))

	test('should return Page as GraphConnection', async () => {
		const pager = createAuthorPager(SortDirection.ascending)
		const pagination = Pagination.forward(5)
		const expected = slice(0, pagination.first, collection)
		const connection = await pager.getConnection(pagination)
		expect(connection).toStrictEqual({
			edges: expected.data.map((node) => pager.generateEdge(node)),
			pageInfo: {
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: false
			},
			totalCount: 20
		})
		expect(connection.edges.length).toBe(5)
	})
})

describe('CollectionPager.decodeCursor()', () => {
	let pager: Pager<Author>

	beforeEach(async () => {
		pager = createAuthorPager(SortDirection.ascending)
	})

	test('should use base64decode as default decoder', async () => {
		const decoded = pager.decodeCursor('MjAyMC0wMS0wMVQwMDowMDowMC4wMDBaLDAwMDA=')
		expect(decoded).toEqual({ createdAt: '2020-01-01T00:00:00.000Z', id: '0000' })
	})

	test('should decode cursor from string', async () => {
		pager.decoder = (value: string) => value
		const decoded = pager.decodeCursor('2020-01-01T00:00:00.000Z,0000')
		expect(decoded).toEqual({ createdAt: '2020-01-01T00:00:00.000Z', id: '0000' })
	})

	test('should decode cursor from base64', async () => {
		pager.decoder = base64Decode
		const decoded = pager.decodeCursor('MjAyMC0wMS0wMVQwMDowMDowMC4wMDBaLDAwMDA=')
		expect(decoded).toEqual({ createdAt: '2020-01-01T00:00:00.000Z', id: '0000' })
	})
})

describe('CollectionPager.encodeCursor()', () => {
	let author: Author
	let pager: Pager<Author>

	beforeEach(async () => {
		author = hydrate(Author, {
			id: '0000',
			name: `author-0000`,
			createdAt: new Date('2020-01-01T00:00:00.000Z'),
			age: 20,
			gender: 'male'
		})
		pager = createAuthorPager(SortDirection.ascending)
	})

	test('should use base64Encode as default encoder', async () => {
		const cursor = pager.encodeCursor(author)
		expect(cursor).toBe('MjAyMC0wMS0wMVQwMDowMDowMC4wMDBaLDAwMDA=')
	})

	test('should encode cursor as base 64', async () => {
		pager.encoder = base64Encode
		const cursor = pager.encodeCursor(author)
		expect(cursor).toBe('MjAyMC0wMS0wMVQwMDowMDowMC4wMDBaLDAwMDA=')
	})

	test('should encode cursor as string', async () => {
		pager.encoder = (value: string) => value
		const cursor = pager.encodeCursor(author)
		expect(cursor).toBe(`2020-01-01T00:00:00.000Z,0000`)
	})
})

describe('should allow pagination when sort is done with a field that contain null values', () => {
	const dateContainerAscSorts: Sort<keyof DateContainer>[] = [Sort.ascending('a'), Sort.ascending('b')]
	const dateContainerDescSorts: Sort<keyof DateContainer>[] = [Sort.descending('a'), Sort.descending('b')]
	const collection = factories.createDateContainers(100)
	const asc = sortArrayWith(dateContainerAscSorts, collection)
	const desc = sortArrayWith(dateContainerDescSorts, collection)
	const createDateContainerPager = (direction: SortDirection) => {
		return new Pager(DateContainer, {
			query: database.manager.createQueryBuilder(DateContainer, 'container'),
			sorts: direction === SortDirection.ascending ? dateContainerAscSorts : dateContainerDescSorts
		})
	}

	beforeAll(async () => database.manager.insert(DateContainer, collection))
	afterAll(async () => database.manager.delete(DateContainer, mapIds(collection)))

	test('asc - should handle null values sort', async () => {
		const expected = slice(0, 10, asc)
		const pager = createDateContainerPager(SortDirection.ascending)
		const result = await pager.getPage(Pagination.forward(10))
		expect(result).toEqual({
			data: expected.data,
			pageInfo: {
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: false
			},
			totalCount: collection.length
		})
	})
	test('desc - should handle null values sort', async () => {
		const expected = slice(0, 10, desc)
		const pager = createDateContainerPager(SortDirection.descending)
		const result = await pager.getPage(Pagination.forward(10))
		expect(result).toEqual({
			data: expected.data,
			pageInfo: {
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: false
			},
			totalCount: collection.length
		})
	})
})

describe('Performance: allow query without `totalCount` for better performance on large tables', () => {
	const collection = factories.createAuthors(20)

	beforeAll(() => database.manager.insert(Author, collection))
	afterAll(() => database.manager.delete(Author, mapIds(collection)))

	describe('Pager.getPage()', () => {
		test('should include `totalCount` as default behaviour', async () => {
			const pager = createAuthorPager(SortDirection.ascending)
			const connection = await pager.getPage(Pagination.forward(5))
			expect(connection).toMatchObject({ totalCount: 20 })
		})
		test('should include `totalCount`', async () => {
			const pagination = Pagination.forward(5)
			pagination.isCountRequested = true
			const pager = createAuthorPager(SortDirection.ascending)
			const connection = await pager.getPage(pagination)
			expect(connection).toMatchObject({ totalCount: 20 })
		})
		test('should not include `totalCount`', async () => {
			const pagination = Pagination.forward(5)
			pagination.isCountRequested = false
			const pager = createAuthorPager(SortDirection.ascending)
			const connection = await pager.getPage(pagination)
			expect(connection).toMatchObject({ totalCount: null })
		})
	})

	describe('Pager.getConnection()', () => {
		test('should include `totalCount` as default behaviour', async () => {
			const pager = createAuthorPager(SortDirection.ascending)
			const connection = await pager.getConnection(Pagination.forward(5))
			expect(connection).toMatchObject({ totalCount: 20 })
		})
		test('should include `totalCount`', async () => {
			const pagination = Pagination.forward(5)
			pagination.isCountRequested = true
			const pager = createAuthorPager(SortDirection.ascending)
			const connection = await pager.getConnection(pagination)
			expect(connection).toMatchObject({ totalCount: 20 })
		})
		test('should not include `totalCount`', async () => {
			const pagination = Pagination.forward(5)
			pagination.isCountRequested = false
			const pager = createAuthorPager(SortDirection.ascending)
			const connection = await pager.getConnection(pagination)
			expect(connection).toMatchObject({ totalCount: null })
		})
	})
})
