import { Pagination, PaginationCursorTransformer, Sort } from '@mxvincent/query-params'
import { Author, createAuthors, createDateContainers, DateContainer, slice } from '../helpers/test-helpers'
import { ArrayPager } from './pagination'
import { sortArrayWith } from './sort'

const DATASET_SIZE = 10
const PAGE_SIZE = 3

describe('Pager.getPage()', () => {
	describe.each<{ dataset: Author[]; description: string }>([
		{
			description: `sequential id's, unique createdAt`,
			dataset: createAuthors(DATASET_SIZE)
		},
		{
			description: `sequential id's, duplicated createdAt`,
			dataset: createAuthors(DATASET_SIZE, 2)
		},
		{
			description: `random ids, duplicated createdAt`,
			dataset: createAuthors(DATASET_SIZE, 3, true)
		}
	])('[resources] $description', ({ dataset }) => {
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
			let resources: Author[]
			let pager: ArrayPager<Author>
			let cursorTransformer: PaginationCursorTransformer<Author>

			beforeAll(() => {
				resources = sortArrayWith(dataset, sorts)
				pager = new ArrayPager(resources, { filters: [], sorts })
				cursorTransformer = pager.cursorTransformer
			})

			test(`page 1: get ${PAGE_SIZE} items`, async () => {
				const expected = slice(resources, { take: PAGE_SIZE, cursorTransformer })

				const result = await pager.getPage(Pagination.take(PAGE_SIZE))

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
			test(`page 2: get ${PAGE_SIZE} items`, async () => {
				const expected = slice(resources, { take: PAGE_SIZE, skip: PAGE_SIZE, cursorTransformer })

				const result = await pager.getPage(
					Pagination.take(PAGE_SIZE, cursorTransformer.encode(resources[PAGE_SIZE - 1]))
				)

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
			test(`page 3: get ${PAGE_SIZE} items`, async () => {
				const expected = slice(resources, { take: PAGE_SIZE, skip: PAGE_SIZE, cursorTransformer })

				const result = await pager.getPage(
					Pagination.take(PAGE_SIZE, cursorTransformer.encode(resources[PAGE_SIZE - 1]))
				)

				expect(result).toEqual({
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
			test(`page 4: get ${DATASET_SIZE - PAGE_SIZE * 3} items`, async () => {
				const expected = slice(resources, { take: PAGE_SIZE, skip: PAGE_SIZE, cursorTransformer })

				const result = await pager.getPage(
					Pagination.take(PAGE_SIZE, cursorTransformer.encode(resources[PAGE_SIZE - 1]))
				)

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
		})
	})
})

describe('should allow pagination when sort is done with a field that contain null values', () => {
	const resources = createDateContainers(DATASET_SIZE)

	test('[SORT] asc(a) + asc (b)', async () => {
		const sorts: Sort<keyof DateContainer>[] = [Sort.asc('a'), Sort.asc('b')]
		const pager = new ArrayPager(resources, { filters: [], sorts })
		const expected = slice(sortArrayWith(resources, sorts), {
			take: PAGE_SIZE,
			cursorTransformer: pager.cursorTransformer
		})

		const result = await pager.getPage(Pagination.take(PAGE_SIZE))

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
		const pager = new ArrayPager(resources, { filters: [], sorts })
		const expected = slice(sortArrayWith(resources, sorts), {
			take: PAGE_SIZE,
			cursorTransformer: pager.cursorTransformer
		})

		const result = await pager.getPage(Pagination.take(PAGE_SIZE))

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
