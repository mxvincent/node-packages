import { ListQueryParameter, Pagination } from '@mxvincent/query-params'
import { randomUUID } from 'node:crypto'
import { In } from 'typeorm'
import { Author, factories, useTestingDatabase } from '../@jest/database'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import { Pager } from '../pagination'
import { TypeormRepository } from './repository'

const database = useTestingDatabase()
const repository = new TypeormRepository(database.manager, Author)

describe('Repository.getPage()', () => {
	test('should create  query builder', async () => {
		const createQueryBuilderSpy = jest.spyOn(database.manager, 'createQueryBuilder')
		const getPageSpy = jest.spyOn(Pager.prototype, 'getPage')
		const options = new ListQueryParameter({ pagination: Pagination.forward(10) })
		await repository.getPage(options)
		expect(createQueryBuilderSpy).toHaveBeenCalledWith(Author, 'root')
		expect(getPageSpy).toHaveBeenCalledWith(options.pagination)
	})
	test('should return 10 first records', async () => {
		await database.manager.save(Author, factories.createAuthors(20))
		const page = await repository.getPage(new ListQueryParameter({ pagination: Pagination.forward(10) }))
		expect(page.data).toHaveLength(10)
	})
})

describe('Repository.findMany()', () => {
	test('should return empty array', async () => {
		const result = await repository.findMany({ name: 'Alice' })
		expect(result).toHaveLength(0)
	})
	test('should return records', async () => {
		await database.manager.insert(Author, [
			factories.createAuthor({ name: 'Alice' }),
			factories.createAuthor({ name: 'Alice' }),
			factories.createAuthor({ name: 'Bob' }),
			factories.createAuthor({ name: 'Bob' }),
			factories.createAuthor({ name: 'Bob' })
		])
		const result = await repository.findMany({ name: In(['Alice', 'Bob']) })
		expect(result).toHaveLength(5)
	})
})

describe('Repository.findOne()', () => {
	test('should return record', async () => {
		const id = randomUUID()
		await database.manager.insert(Author, factories.createAuthor({ id, name: 'Alice' }))
		expect(await repository.findOne({ id })).toBeInstanceOf(Author)
	})
	test('should return null', async () => {
		expect(await repository.findOne({ id: randomUUID() })).toBeNull()
	})
})

describe('Repository.findOneOrFail()', () => {
	const findOrFailSpy = jest.spyOn(TypeormRepository.prototype, 'findOneOrFail')
	beforeEach(async () => {
		findOrFailSpy.mockClear()
	})
	test('should return record', async () => {
		const id = randomUUID()
		await database.manager.insert(Author, factories.createAuthor({ id }))
		const options = { id }
		expect(await repository.findOneOrFail(options)).toBeInstanceOf(Author)
		expect(findOrFailSpy).toHaveBeenCalledTimes(1)
		expect(findOrFailSpy).toHaveBeenCalledWith(options)
	})
	test('should throw `ResourceNotFoundError`', async () => {
		const id = randomUUID()
		const options = { id }
		await expect(() => repository.findOneOrFail(options)).rejects.toStrictEqual(
			ResourceNotFoundError.format('Author', id)
		)
		expect(findOrFailSpy).toHaveBeenCalledTimes(1)
		expect(findOrFailSpy).toHaveBeenCalledWith(options)
	})
})

describe('Repository.create()', () => {
	const payload: Partial<Author> = {
		name: 'alice',
		gender: 'female'
	}

	test('should return user instance', async () => {
		const record = await repository.create(payload)
		expect(record).toBeInstanceOf(Author)
	})

	test('should create database record', async () => {
		const record = await repository.create(payload)
		expect(await database.manager.countBy(Author, { id: record.id })).toBe(1)
	})
})

describe('Repository.update()', () => {
	let author: Author

	beforeEach(async () => {
		author = factories.createAuthor()
		await database.manager.insert(Author, author)
	})

	test('should update in memory record', async () => {
		await repository.update(author, { name: 'new-username' })
		expect(author).toHaveProperty('name', 'new-username')
	})

	test('should update database record', async () => {
		await repository.update(author, { name: 'new-username' })
		const record = await repository.findOne({ id: author.id })
		expect(record).toHaveProperty('name', 'new-username')
	})

	test('should return record instance', async () => {
		await repository.update(author, { name: 'new-username' })
		expect(await repository.update(author, { name: 'new-username' })).toBe(author)
	})

	test('should fail when trying to update non existing record', async () => {
		author = factories.createAuthor()
		await expect(() => repository.update(author, { name: 'new-username' })).rejects.toStrictEqual(
			ResourceNotFoundError.format('Author', author.id)
		)
	})
})

describe('Repository.delete()', () => {
	test('should throw an error when user not exists', async () => {
		const author = factories.createAuthor()
		await expect(() => repository.delete(author)).rejects.toStrictEqual(
			ResourceNotFoundError.format('Author', author.id)
		)
	})

	test('should delete database record', async () => {
		const author = factories.createAuthor()
		await database.manager.insert(Author, author)
		await repository.delete(author)
		expect(await database.manager.findOneBy(Author, { id: author.id })).toBeNull()
	})

	test('should return record', async () => {
		const author = factories.createAuthor()
		await database.manager.insert(Author, author)
		expect(await repository.delete(author)).toBe(author)
	})
})
