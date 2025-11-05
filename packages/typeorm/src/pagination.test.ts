import { Pagination, Sort } from '@mxvincent/query-params'
import { slice, sortArrayWith } from '@package/incubator'
import { Author, DateContainer, factories, useDatabaseContext, useDatabaseTransaction } from './@jest/database'
import { Pager } from './pagination'

const DATASET_SIZE = 50
const PAGE_SIZE = 10

const database = useDatabaseContext()

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
		useDatabaseTransaction(database, 'group')

		beforeAll(() => database.manager.insert(Author, rawDataset))

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
			const dataset = sortArrayWith(rawDataset, sorts)

			test('take 10 element at the start of the dataset', async () => {
				const pager = createAuthorPager(sorts)
				const { cursorTransformer } = pager
				const expected = slice(dataset, { take: 10, cursorTransformer })

				const result = await pager.getPage(Pagination.take(10))

				expect(result).toStrictEqual({
					edges: expected,
					pageInfo: {
						cursor: null,
						pageSize: PAGE_SIZE,
						itemsCount: expected.length,
						hasNextPage: true
					},
					totalCount: DATASET_SIZE
				})
			})

			test('take 10 elements after the 20th', async () => {
				const pager = createAuthorPager(sorts)
				const { cursorTransformer } = pager
				const expected = slice(dataset, { take: 10, skip: 20, cursorTransformer })

				const result = await pager.getPage(Pagination.take(10, cursorTransformer.encode(dataset[19])))

				expect(result).toStrictEqual({
					edges: expected,
					pageInfo: {
						cursor: expect.any(String),
						pageSize: PAGE_SIZE,
						itemsCount: expected.length,
						hasNextPage: true
					},
					totalCount: DATASET_SIZE
				})
			})

			test('take 10 elements after the 45th (only 5 left)', async () => {
				const pager = createAuthorPager(sorts)
				const { cursorTransformer } = pager
				const expected = slice(dataset, { take: 10, skip: 45, cursorTransformer })

				const result = await pager.getPage(Pagination.take(10, cursorTransformer.encode(dataset[44])))

				expect(result).toStrictEqual({
					edges: expected,
					pageInfo: {
						cursor: expect.any(String),
						pageSize: PAGE_SIZE,
						itemsCount: expected.length,
						hasNextPage: false
					},
					totalCount: DATASET_SIZE
				})
			})
		})
	})
})

describe('should allow pagination when sort is done with a field that contain null values', () => {
	useDatabaseTransaction(database, 'group')

	const rawDataset = factories.createDateContainers(DATASET_SIZE)
	const createDateContainerPager = (sorts: Sort<keyof DateContainer>[]) => {
		const query = database.manager.createQueryBuilder(DateContainer, 'container')
		return new Pager(DateContainer, { query, sorts })
	}

	beforeAll(async () => database.manager.insert(DateContainer, rawDataset))

	test('[SORT] asc(a) + asc (b)', async () => {
		const sorts: Sort<keyof DateContainer>[] = [Sort.asc('a'), Sort.asc('b')]
		const dataset = sortArrayWith(rawDataset, sorts)
		const pager = createDateContainerPager(sorts)
		const expected = slice(dataset, { take: 10, cursorTransformer: pager.cursorTransformer })

		const result = await pager.getPage(Pagination.take(10))

		expect(result).toStrictEqual({
			edges: expected,
			pageInfo: {
				cursor: null,
				pageSize: PAGE_SIZE,
				itemsCount: expected.length,
				hasNextPage: true
			},
			totalCount: DATASET_SIZE
		})
	})
	test('[SORT] desc(a) + desc(b)', async () => {
		const sorts: Sort<keyof DateContainer>[] = [Sort.desc('a'), Sort.desc('b')]
		const dataset = sortArrayWith(rawDataset, sorts)
		const pager = createDateContainerPager(sorts)
		const expected = slice(dataset, { take: 10, cursorTransformer: pager.cursorTransformer })

		const result = await pager.getPage(Pagination.take(10))

		expect(result).toStrictEqual({
			edges: expected,
			pageInfo: {
				cursor: null,
				pageSize: PAGE_SIZE,
				itemsCount: expected.length,
				hasNextPage: true
			},
			totalCount: DATASET_SIZE
		})
	})
})

describe('Performance: allow query without `totalCount` for better performance on large tables', () => {
	useDatabaseTransaction(database, 'group')

	const dataset = factories.createAuthors(DATASET_SIZE)
	let pager: Pager<Author>

	beforeAll(async () => {
		await database.manager.insert(Author, dataset)
		pager = createAuthorPager([])
	})

	describe('Pager.getPage()', () => {
		test('should include `totalCount` as default behaviour', async () => {
			const connection = await pager.getPage(Pagination.take(5))

			expect(connection).toMatchObject({ totalCount: DATASET_SIZE })
		})

		test('should include `totalCount`', async () => {
			const pagination = Pagination.take(5)
			pagination.isCountRequested = true

			const connection = await pager.getPage(pagination)

			expect(connection).toMatchObject({ totalCount: DATASET_SIZE })
		})

		test('should not include `totalCount`', async () => {
			const pagination = Pagination.take(5)
			pagination.isCountRequested = false

			const connection = await pager.getPage(pagination)

			expect(connection).toMatchObject({ totalCount: null })
		})
	})
})
