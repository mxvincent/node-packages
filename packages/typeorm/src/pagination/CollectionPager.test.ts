import { Sort, SortDirection } from '@mxvincent/query'
import { lensProp, map, view } from 'ramda'
import { slice, sortArrayWith } from '../@jest'
import { database, DateContainer, factories, User } from '../@jest/database'
import { CollectionPager } from './CollectionPager'

const mapIds = map(view(lensProp<{ id: string }>('id')))

beforeAll(async () => database.initialize())
afterAll(async () => database.destroy())

const usersAscSorts: Sort<keyof User>[] = [
	{ direction: 'asc', path: 'createdAt' },
	{ direction: 'asc', path: 'id' }
]

const usersDescSorts: Sort<keyof User>[] = [
	{ direction: 'desc', path: 'createdAt' },
	{ direction: 'asc', path: 'id' }
]

const createUserPager = (direction: SortDirection) => {
	return new CollectionPager(User, {
		query: database.createQueryBuilder(User, 'user'),
		sorts: direction === 'asc' ? usersAscSorts : usersDescSorts
	})
}

const totalCount = 50
describe.each<{ collection: User[]; description: string }>([
	{ collection: factories.createUsers(totalCount), description: `DATASET: sequential id's, unique createdAt` },
	{ collection: factories.createUsers(totalCount, 2), description: `DATASET: sequential id's, duplicated createdAt` },
	{ collection: factories.createUsers(totalCount, 3, true), description: `DATASET: random ids, duplicated createdAt` }
])('$description', ({ collection }) => {
	const asc = sortArrayWith(usersAscSorts, collection)
	const desc = sortArrayWith(usersDescSorts, collection)

	beforeAll(async () => database.manager.insert(User, collection))
	afterAll(async () => database.manager.delete(User, mapIds(collection)))

	describe('should return n first items', () => {
		test('asc - 12345 - should return first items without cursor', async () => {
			const expected = slice(0, 10, asc)
			const pager = createUserPager('asc')
			const result = await pager.getPage({ size: 10 })
			expect(result).toEqual({
				data: expected.data,
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: false,
				totalCount
			})
		})
		test('desc - 54321 - should return first items without cursor', async () => {
			const expected = slice(0, 10, desc)
			const pager = createUserPager('desc')
			const result = await pager.getPage({ size: 10 })
			expect(result).toEqual({
				data: expected.data,
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: false,
				totalCount
			})
		})
		test('asc - 1<|2345 - should return first items before cursor', async () => {
			const expected = slice(0, 2, asc)
			const pager = createUserPager('asc')
			const result = await pager.getPage({
				size: 10,
				before: pager.encodeCursor(asc[2] as User)
			})
			expect(result).toEqual({
				data: expected.data,
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: false,
				totalCount
			})
		})
		test('desc - 5<|4321 - should return first items before cursor', async () => {
			const expected = slice(0, 2, desc)
			const pager = createUserPager('desc')
			const result = await pager.getPage({
				size: 10,
				before: pager.encodeCursor(desc[2] as User)
			})
			expect(result).toEqual({
				data: expected.data,
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: false,
				totalCount
			})
		})
	})

	describe('should return n items from the middle of the dataset', () => {
		test('asc - 12|>345 - should return n items after cursor', async () => {
			const expected = slice(20, 10, asc)
			const pager = createUserPager('asc')
			const result = await pager.getPage({
				size: 10,
				after: pager.encodeCursor(asc[19] as User)
			})
			expect(result).toEqual({
				data: expected.data,
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: true,
				startCursor: pager.encodeCursor(expected.first),
				totalCount
			})
			expect(result.data.length).toBe(10)
		})
		test('asc - 123<|45 - should return n items before cursor ', async () => {
			const expected = slice(20, 10, asc)
			const pager = createUserPager('asc')
			const result = await pager.getPage({
				size: 10,
				before: pager.encodeCursor(asc[30] as User)
			})
			expect(result).toEqual({
				data: expected.data,
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: true,
				startCursor: pager.encodeCursor(expected.first),
				totalCount
			})
			expect(result.data.length).toBe(10)
		})
		test('desc - 54|>321 - should return n items after cursor', async () => {
			const expected = slice(20, 10, desc)
			const pager = createUserPager('desc')
			const result = await pager.getPage({
				size: 10,
				after: pager.encodeCursor(desc[19] as User)
			})
			expect(result).toEqual({
				data: expected.data,
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: true,
				totalCount
			})
			expect(result.data.length).toBe(10)
		})
		test('desc - 543<|21 - should return n items before cursor', async () => {
			const expected = slice(20, 10, desc)
			const pager = createUserPager('desc')
			const result = await pager.getPage({
				size: 10,
				before: pager.encodeCursor(desc[30] as User)
			})
			expect(result).toEqual({
				data: expected.data,
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: true,
				hasPrevPage: true,
				totalCount
			})
			expect(result.data.length).toBe(10)
		})
	})

	describe('should return last items ', function () {
		test('asc - 1234|>5 - get n last items', async () => {
			const expected = slice(45, 10, asc)
			const pager = createUserPager('asc')
			const result = await pager.getPage({
				size: 10,
				after: pager.encodeCursor(asc[44] as User)
			})
			expect(result).toEqual({
				data: expected.data,
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: false,
				hasPrevPage: true,
				totalCount
			})
			expect(result.data.length).toBe(5)
		})
		test('desc - 5432|>1 - get n last items after', async () => {
			const expected = slice(45, 10, desc)
			const pager = createUserPager('desc')
			const result = await pager.getPage({
				size: 10,
				after: pager.encodeCursor(desc[44] as User)
			})
			expect(result).toEqual({
				data: expected.data,
				startCursor: pager.encodeCursor(expected.first),
				endCursor: pager.encodeCursor(expected.last),
				hasNextPage: false,
				hasPrevPage: true,
				totalCount
			})
			expect(result.data.length).toBe(5)
		})
	})
})

const dateContainerAscSorts: Sort<keyof DateContainer>[] = [
	{ direction: 'asc', path: 'a' },
	{ direction: 'asc', path: 'b' }
]
const dateContainerDescSorts: Sort<keyof DateContainer>[] = [
	{ direction: 'desc', path: 'a' },
	{ direction: 'desc', path: 'b' }
]
const createDateContainerPager = (direction: SortDirection) => {
	return new CollectionPager(DateContainer, {
		query: database.createQueryBuilder(DateContainer, 'container'),
		sorts: direction === 'asc' ? dateContainerAscSorts : dateContainerDescSorts
	})
}

describe('should allow pagination when sort is done with a field that contain null values', () => {
	const collection = factories.createDateContainers(100)
	const asc = sortArrayWith(dateContainerAscSorts, collection)
	const desc = sortArrayWith(dateContainerDescSorts, collection)

	beforeAll(async () => database.manager.insert(DateContainer, collection))
	afterAll(async () => database.manager.delete(DateContainer, mapIds(collection)))

	test('asc - should handle null values sort', async () => {
		const expected = slice(0, 10, asc)
		const pager = createDateContainerPager('asc')
		const result = await pager.getPage({ size: 10 })
		expect(result).toEqual({
			data: expected.data,
			startCursor: pager.encodeCursor(expected.first),
			endCursor: pager.encodeCursor(expected.last),
			hasNextPage: true,
			hasPrevPage: false,
			totalCount: collection.length
		})
	})
	test('desc - should handle null values sort', async () => {
		const expected = slice(0, 10, desc)
		const pager = createDateContainerPager('desc')
		const result = await pager.getPage({ size: 10 })
		expect(result).toEqual({
			data: expected.data,
			startCursor: pager.encodeCursor(expected.first),
			endCursor: pager.encodeCursor(expected.last),
			hasNextPage: true,
			hasPrevPage: false,
			totalCount: collection.length
		})
	})
})
