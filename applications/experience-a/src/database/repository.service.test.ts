import { User } from '#/database/entities/User'
import { factories } from '#/database/factories.provider'
import { useIsolatedDatabase } from '@jest/database'
import { ListQueryParameter, Pagination } from '@mxvincent/query-params'
import { In, Pager, ResourceNotFoundError } from '@mxvincent/typeorm'
import { randomUUID } from 'node:crypto'
import { times } from 'ramda'
import { Repository } from './repository.service'

const database = useIsolatedDatabase()
const repository = database.repository(User)

describe('Repository.getGQLConnection()', () => {
	test('should create query builder', async () => {
		const createQueryBuilderSpy = jest.spyOn(database.manager, 'createQueryBuilder')
		const getConnectionSpy = jest.spyOn(Pager.prototype, 'getConnection')
		const options = new ListQueryParameter({ pagination: Pagination.forward(10) })
		await repository.getConnection(options)
		expect(createQueryBuilderSpy).toHaveBeenCalledWith(User, 'root')
		expect(getConnectionSpy).toHaveBeenCalledWith(options.pagination)
	})
	test('should return 10 first users', async () => {
		await database.manager.save(
			User,
			times(() => factories.user(), 20)
		)
		const connection = await repository.getConnection(new ListQueryParameter({ pagination: Pagination.forward(10) }))
		expect(connection.edges).toHaveLength(10)
	})
})

describe('Repository.getPage()', () => {
	test('should create  query builder', async () => {
		const createQueryBuilderSpy = jest.spyOn(database.manager, 'createQueryBuilder')
		const getPageSpy = jest.spyOn(Pager.prototype, 'getPage')
		const options = new ListQueryParameter({ pagination: Pagination.forward(10) })
		await repository.getPage(options)
		expect(createQueryBuilderSpy).toHaveBeenCalledWith(User, 'root')
		expect(getPageSpy).toHaveBeenCalledWith(options.pagination)
	})
	test('should return 10 first users', async () => {
		await database.manager.save(
			User,
			times(() => factories.user(), 20)
		)
		const page = await repository.getPage(new ListQueryParameter({ pagination: Pagination.forward(10) }))
		expect(page.data).toHaveLength(10)
	})
})

describe('Repository.findMany()', () => {
	test('should return empty array', async () => {
		const result = await repository.findMany({ firstName: 'Alice' })
		expect(result).toHaveLength(0)
	})
	test('should return users', async () => {
		await database.manager.insert(User, [
			factories.user({ firstName: 'Alice' }),
			factories.user({ firstName: 'Alice' }),
			factories.user({ firstName: 'Bob' }),
			factories.user({ firstName: 'Bob' }),
			factories.user({ firstName: 'Bob' })
		])
		const result = await repository.findMany({ firstName: In(['Alice', 'Bob']) })
		expect(result).toHaveLength(5)
	})
})

describe('Repository.findOne()', () => {
	test('should return `User` instance', async () => {
		const id = randomUUID()
		await database.manager.save(factories.user({ id }))
		expect(await repository.findOne({ id })).toBeInstanceOf(User)
	})
	test('should return null', async () => {
		expect(await repository.findOne({ id: randomUUID() })).toBeNull()
	})
})

describe('Repository.findOneOrFail()', () => {
	const findOrFailSpy = jest.spyOn(Repository.prototype, 'findOneOrFail')
	beforeEach(async () => {
		findOrFailSpy.mockClear()
	})
	test('should return `User` instance', async () => {
		const id = randomUUID()
		await database.manager.save(factories.user({ id }))
		const options = { id }
		expect(await repository.findOneOrFail(options)).toBeInstanceOf(User)
		expect(findOrFailSpy).toHaveBeenCalledTimes(1)
		expect(findOrFailSpy).toHaveBeenCalledWith(options)
	})
	test('should throw `ResourceNotFoundError`', async () => {
		const id = randomUUID()
		const options = { id }
		await expect(() => repository.findOneOrFail(options)).rejects.toStrictEqual(
			ResourceNotFoundError.format('User', id)
		)
		expect(findOrFailSpy).toHaveBeenCalledTimes(1)
		expect(findOrFailSpy).toHaveBeenCalledWith(options)
	})
})

describe('Repository.create()', () => {
	const payload: Partial<User> = {
		email: 'email@domain.tld',
		username: 'username',
		firstName: 'first',
		lastName: 'last'
	}

	test('should return user instance', async () => {
		const user = await repository.create(payload)
		expect(user).toBeInstanceOf(User)
	})

	test('should create database record', async () => {
		const user = await repository.create(payload)
		expect(await database.manager.countBy(User, { id: user.id })).toBe(1)
	})
})

describe('Repository.update()', () => {
	let user: User

	beforeEach(async () => {
		user = factories.user()
		await database.manager.insert(User, user)
	})

	test('should update in memory record', async () => {
		await repository.update(user, { username: 'new-username' })
		expect(user).toHaveProperty('username', 'new-username')
	})

	test('should update database record', async () => {
		await repository.update(user, { username: 'new-username' })
		const record = await repository.findOne({ id: user.id })
		expect(record).toHaveProperty('username', 'new-username')
	})

	test('should return record instance', async () => {
		await repository.update(user, { username: 'new-username' })
		expect(await repository.update(user, { username: 'new-username' })).toBe(user)
	})

	test('should fail when trying to update non existing record', async () => {
		const user = factories.user()
		await expect(() => repository.update(user, { username: 'new-username' })).rejects.toStrictEqual(
			ResourceNotFoundError.format('User', user.id)
		)
	})
})

describe('Repository.delete()', () => {
	test('should throw an error when user not exists', async () => {
		const user = factories.user()
		await expect(() => repository.delete(user)).rejects.toStrictEqual(ResourceNotFoundError.format('User', user.id))
	})

	test('should delete database record', async () => {
		const user = factories.user()
		await database.manager.insert(User, user)
		await repository.delete(user)
		expect(await database.manager.findOneBy(User, { id: user.id })).toBeNull()
	})

	test('should return record', async () => {
		const user = factories.user()
		await database.manager.insert(User, user)
		expect(await repository.delete(user)).toBe(user)
	})
})
