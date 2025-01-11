import { User } from '#/database/entities/User'
import { factories } from '#/database/factories.provider'
import { Repository } from '#/database/repository.service'
import { getSpyResult } from '#/jest/helpers'
import { useIsolatedDatabase } from '@jest/database'
import { ConflictError } from '@mxvincent/core'
import { ResourceNotFoundError } from '@mxvincent/typeorm'

import { CreateUserPayload, UserService } from './user.service'

const context = useIsolatedDatabase()
const service = new UserService(context)

beforeEach(async () => {
	jest.clearAllMocks()
})

describe('UserService.create()', () => {
	const createUserSpy = jest.spyOn(Repository.prototype, 'create')

	const payload: CreateUserPayload = {
		email: 'email@domain.tld',
		username: 'username',
		firstName: 'first',
		lastName: 'last'
	}

	test('should call Repository.create()', async () => {
		await service.create(payload)
		expect(createUserSpy).toHaveBeenCalledWith(payload)
	})

	test('should return User record', async () => {
		const result = await service.create(payload)
		expect(result).toBeInstanceOf(User)
		expect(result).toMatchObject(expect.objectContaining(payload))
	})

	test('should throw an error when email is already taken', async () => {
		await context.manager.save(factories.user({ email: payload.email }))
		await expect(() => service.create(payload)).rejects.toStrictEqual(new ConflictError('Email already taken.'))
	})

	test('should throw an error when username is already taken', async () => {
		await context.manager.save(factories.user({ username: payload.username }))
		await expect(() => service.create(payload)).rejects.toStrictEqual(new ConflictError('Username already taken.'))
	})
})

describe('UserService.update()', () => {
	const findUserSpy = jest.spyOn(Repository.prototype, 'findOneOrFail')
	const updateUserSpy = jest.spyOn(Repository.prototype, 'update')

	const userPartial = Object.freeze({ email: 'user@domain.tld' })
	const userChanges = Object.freeze({ username: 'username-updated' })

	test('should update user', async () => {
		const user = await context.manager.save(factories.user(userPartial))
		const result = await service.update(userPartial, userChanges)

		expect(findUserSpy).toHaveBeenCalledWith(userPartial)
		expect(updateUserSpy).toHaveBeenCalledWith(await getSpyResult(findUserSpy), userChanges)
		expect(result).toBeInstanceOf(User)
		expect(result).toMatchObject(expect.objectContaining({ ...user, ...userChanges }))
	})

	test('should fail when trying to update non persisted user', async () => {
		const userPartial = { email: 'user@domain.tld' }
		await expect(() => service.update(userPartial, userChanges)).rejects.toStrictEqual(
			ResourceNotFoundError.fromWhereOptions(context.dataSource, User, userPartial)
		)
		expect(findUserSpy).toHaveBeenCalledWith(userPartial)
		expect(updateUserSpy).not.toHaveBeenCalled()
	})

	test('should throw when email is already taken', async () => {
		const conflictingUserPartial = { email: 'already-used@domain.tld' }
		await context.manager.save([factories.user(userPartial), factories.user(conflictingUserPartial)])
		await expect(() => service.update(userPartial, conflictingUserPartial)).rejects.toStrictEqual(
			new ConflictError('Email already taken.')
		)
		expect(findUserSpy).toHaveBeenCalledWith(userPartial)
		expect(updateUserSpy).not.toHaveBeenCalled()
	})

	test('should throw when username is already taken', async () => {
		const userPartial = { username: 'username' }
		const conflictingUserPartial = { username: 'already-used' }
		await context.manager.save([factories.user(userPartial), factories.user(conflictingUserPartial)])
		await expect(() => service.update(userPartial, conflictingUserPartial)).rejects.toStrictEqual(
			new ConflictError('Username already taken.')
		)
		expect(findUserSpy).toHaveBeenCalledWith(userPartial)
		expect(updateUserSpy).not.toHaveBeenCalled()
	})
})

describe('UserService.delete()', () => {
	const findUserSpy = jest.spyOn(Repository.prototype, 'findOneOrFail')
	const deleteUserSpy = jest.spyOn(Repository.prototype, 'delete')

	const userPartial = Object.freeze({ email: 'user@domain.tld' })

	test('should throw an error when user not exists', async () => {
		await expect(() => service.delete(userPartial)).rejects.toStrictEqual(
			ResourceNotFoundError.fromWhereOptions(context.dataSource, User, userPartial)
		)
	})

	test('should call UserRepository.delete() method', async () => {
		await context.manager.save(factories.user(userPartial))
		await service.delete(userPartial)
		expect(findUserSpy).toHaveBeenCalledWith(userPartial)
		expect(deleteUserSpy).toHaveBeenCalledWith(await getSpyResult(findUserSpy))
	})

	test('should return user record', async () => {
		await context.manager.save(factories.user(userPartial))
		const result = await service.delete(userPartial)
		expect(result).toBe(await getSpyResult(findUserSpy))
	})

	test('should delete user from database', async () => {
		const user = await context.manager.save(factories.user())
		await service.delete(user)
		expect(await context.manager.findOneBy(User, { id: user.id })).toBeNull()
	})
})
