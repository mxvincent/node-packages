import { base64Decode, base64Encode } from '@mxvincent/core'
import { Pagination, Sort } from '@mxvincent/query-params'
import { lensProp, map, view } from 'ramda'
import { slice, sortArrayWith } from './@jest'
import { Author, DateContainer, factories, useTestingDatabase } from './@jest/database'
import { hydrate } from './helpers/hydrate'
import { Pager } from './pagination'

const DATASET_SIZE = 50

const mapIds = map(view(lensProp<{ id: string }>('id')))

const database = useTestingDatabase()

const createAuthorPager = (sorts: Sort<keyof Author>[]) => {
	const query = database.manager.createQueryBuilder(Author, 'author')
	return new Pager(Author, { query, sorts })
}

describe('Pager.getPage()', () => {
	describe.each<{ rawDataset: Author[]; description: string }>([
		{
			rawDataset: factories.createAuthors(DATASET_SIZE),
			description: `sequential id's, unique createdAt`
		},
		{
			rawDataset: factories.createAuthors(DATASET_SIZE, 2),
			description: `sequential id's, duplicated createdAt`
		},
		{
			rawDataset: factories.createAuthors(DATASET_SIZE, 3, true),
			description: `random ids, duplicated createdAt`
		}
	])('[DATASET] $description', ({ rawDataset }) => {
		beforeAll(() => database.manager.insert(Author, rawDataset))
		afterAll(() => database.manager.delete(Author, mapIds(rawDataset)))

		describe.each<{ sorts: Sort<keyof Author>[]; description: string }>([
			{
				description: 'asc(id)',
				sorts: [Sort.asc('id')]
			},
			{
				description: 'desc(id)',
				sorts: [Sort.desc('id')]
			},
			{
				description: 'asc(createdAt)',
				sorts: [Sort.asc('createdAt')]
			},
			{
				description: 'desc(createdAt)',
				sorts: [Sort.desc('createdAt')]
			},
			{
				description: 'asc(createdAt) + asc(id)',
				sorts: [Sort.asc('createdAt'), Sort.asc('id')]
			},
			{
				description: 'desc(createdAt) + desc(id)',
				sorts: [Sort.desc('createdAt'), Sort.desc('id')]
			},
			{
				description: 'asc(createdAt) + desc(id)',
				sorts: [Sort.asc('createdAt'), Sort.desc('id')]
			},
			{
				description: 'desc(createdAt) + asc(id)',
				sorts: [Sort.desc('createdAt'), Sort.asc('id')]
			}
		])('[SORT] $description', ({ sorts }) => {
			const dataset = sortArrayWith(sorts, rawDataset)

			test('take 10 element at the start of the dataset', async () => {
				const expected = slice(dataset, { take: 10 })
				const pager = createAuthorPager(sorts)

				const result = await pager.getPage(Pagination.forward(10))

				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						startCursor: pager.encodeCursor(expected.first),
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: true,
						hasPrevPage: false
					},
					totalCount: DATASET_SIZE
				})
			})

			test('take 10 elements after the 20th', async () => {
				const expected = slice(dataset, { take: 10, skip: 20 })
				const pager = createAuthorPager(sorts)

				const result = await pager.getPage(Pagination.forward(10, pager.encodeCursor(dataset[19])))

				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						startCursor: pager.encodeCursor(expected.first),
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: true,
						hasPrevPage: true
					},
					totalCount: DATASET_SIZE
				})
			})

			test('take 10 elements before the 21th', async () => {
				const expected = slice(dataset, { take: 10, skip: 10 })
				const pager = createAuthorPager(sorts)

				const result = await pager.getPage(Pagination.backward(10, pager.encodeCursor(dataset[20])))

				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						startCursor: pager.encodeCursor(expected.first),
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: true,
						hasPrevPage: true
					},
					totalCount: DATASET_SIZE
				})
			})

			test('take 10 elements before the 5th (only 5 left)', async () => {
				const expected = slice(dataset, { take: 5 })
				const pager = createAuthorPager(sorts)

				const result = await pager.getPage(Pagination.backward(10, pager.encodeCursor(dataset[5])))

				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						startCursor: pager.encodeCursor(expected.first),
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: true,
						hasPrevPage: false
					},
					totalCount: DATASET_SIZE
				})
			})

			test('take 10 elements after the 45th (only 5 left)', async () => {
				const expected = slice(dataset, { take: 10, skip: 45 })
				const pager = createAuthorPager(sorts)

				const result = await pager.getPage(Pagination.forward(10, pager.encodeCursor(dataset[44])))

				expect(result).toEqual({
					data: expected.data,
					pageInfo: {
						startCursor: pager.encodeCursor(expected.first),
						endCursor: pager.encodeCursor(expected.last),
						hasNextPage: false,
						hasPrevPage: true
					},
					totalCount: DATASET_SIZE
				})
			})
		})
	})
})

describe('Pager.getConnection()', () => {
	const dataset = factories.createAuthors(DATASET_SIZE)

	beforeAll(() => database.manager.insert(Author, dataset))
	afterAll(() => database.manager.delete(Author, mapIds(dataset)))

	test('should return Page as GraphConnection', async () => {
		const pager = createAuthorPager([])
		const expected = slice(dataset, { take: 10 })

		const connection = await pager.getConnection(Pagination.forward(10))

		expect(connection).toStrictEqual({
			edges: expected.data.map((node) => pager.generateEdge(node)),
			pageInfo: {
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: false
			},
			totalCount: DATASET_SIZE
		})
		expect(connection.edges.length).toBe(10)
	})
})

describe('CollectionPager.decodeCursor()', () => {
	let pager: Pager<Author>

	beforeEach(async () => {
		pager = createAuthorPager([Sort.asc('createdAt')])
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
		pager = createAuthorPager([Sort.asc('createdAt')])
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
	const rawDataset = factories.createDateContainers(DATASET_SIZE)
	const createDateContainerPager = (sorts: Sort<keyof DateContainer>[]) => {
		const query = database.manager.createQueryBuilder(DateContainer, 'container')
		return new Pager(DateContainer, { query, sorts })
	}

	beforeAll(async () => database.manager.insert(DateContainer, rawDataset))
	afterAll(async () => database.manager.delete(DateContainer, mapIds(rawDataset)))

	test('[SORT] asc(a) + asc (b)', async () => {
		const sorts: Sort<keyof DateContainer>[] = [Sort.asc('a'), Sort.asc('b')]
		const dataset = sortArrayWith(sorts, rawDataset)
		const expected = slice(dataset, { take: 10 })
		const pager = createDateContainerPager(sorts)

		const result = await pager.getPage(Pagination.forward(10))

		expect(result).toEqual({
			data: expected.data,
			pageInfo: {
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: false
			},
			totalCount: dataset.length
		})
	})
	test('[SORT] desc(a) + desc(b)', async () => {
		const sorts: Sort<keyof DateContainer>[] = [Sort.desc('a'), Sort.desc('b')]
		const dataset = sortArrayWith(sorts, rawDataset)
		const expected = slice(dataset, { take: 10 })
		const pager = createDateContainerPager(sorts)

		const result = await pager.getPage(Pagination.forward(10))

		expect(result).toEqual({
			data: expected.data,
			pageInfo: {
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: false
			},
			totalCount: dataset.length
		})
	})
})

describe('Performance: allow query without `totalCount` for better performance on large tables', () => {
	const dataset = factories.createAuthors(DATASET_SIZE)
	let pager: Pager<Author>

	beforeAll(async () => {
		await database.manager.insert(Author, dataset)
		pager = createAuthorPager([])
	})
	afterAll(() => database.manager.delete(Author, mapIds(dataset)))

	describe('Pager.getPage()', () => {
		test('should include `totalCount` as default behaviour', async () => {
			const connection = await pager.getPage(Pagination.forward(5))

			expect(connection).toMatchObject({ totalCount: DATASET_SIZE })
		})

		test('should include `totalCount`', async () => {
			const pagination = Pagination.forward(5)
			pagination.isCountRequested = true

			const connection = await pager.getPage(pagination)

			expect(connection).toMatchObject({ totalCount: DATASET_SIZE })
		})

		test('should not include `totalCount`', async () => {
			const pagination = Pagination.forward(5)
			pagination.isCountRequested = false

			const connection = await pager.getPage(pagination)

			expect(connection).toMatchObject({ totalCount: null })
		})
	})

	describe('Pager.getConnection()', () => {
		test('should include `totalCount` as default behaviour', async () => {
			const connection = await pager.getConnection(Pagination.forward(5))

			expect(connection).toMatchObject({ totalCount: DATASET_SIZE })
		})

		test('should include `totalCount`', async () => {
			const pagination = Pagination.forward(5)
			pagination.isCountRequested = true

			const connection = await pager.getConnection(pagination)

			expect(connection).toMatchObject({ totalCount: DATASET_SIZE })
		})

		test('should not include `totalCount`', async () => {
			const pagination = Pagination.forward(5)
			pagination.isCountRequested = false

			const connection = await pager.getConnection(pagination)

			expect(connection).toMatchObject({ totalCount: null })
		})
	})
})
