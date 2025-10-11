import { Organization } from '#/database/entities/Organization'
import { OrganizationMember } from '#/database/entities/OrganizationMember'
import { factories } from '#/database/factories.provider'
import { Repository } from '#/database/repository.service'
import { useIsolatedDatabase } from '#/jest/database'
import { getSpyResult } from '#/jest/helpers'
import { ConflictError, NotImplementedError } from '@mxvincent/core'
import { ResourceNotFoundError } from '@mxvincent/typeorm'
import { randomUUID } from 'node:crypto'
import { CreateOrganizationPayload, OrganizationService } from './organization.service'

const context = useIsolatedDatabase()
const service = new OrganizationService(context)

const createOrganizationMember = async () => {
	const organization = factories.organization()
	const user = factories.user()
	const organizationMember = factories.organizationMember({ organization, user, role: 'admin' })
	await context.manager.save([organization, user, organizationMember])
	return { organization, organizationMember, user }
}

beforeEach(async () => {
	jest.clearAllMocks()
})

describe('OrganizationService.create()', () => {
	const createOrganizationSpy = jest.spyOn(Repository.prototype, 'create')

	const payload: CreateOrganizationPayload = {
		name: 'org-name'
	}

	test('should call OrganizationRepository.create()', async () => {
		await service.create(payload)
		expect(createOrganizationSpy).toHaveBeenCalledWith(payload)
	})

	test('should return Organization record', async () => {
		const result = await service.create(payload)
		expect(result).toBeInstanceOf(Organization)
		expect(result).toMatchObject(expect.objectContaining(payload))
	})

	test('should throw an error when name is already taken', async () => {
		await context.manager.save(factories.organization(payload))
		await expect(() => service.create(payload)).rejects.toStrictEqual(new ConflictError('Name already taken.'))
	})
})

describe('OrganizationService.update()', () => {
	const findOrganizationSpy = jest.spyOn(Repository.prototype, 'findOneOrFail')
	const updateOrganizationSpy = jest.spyOn(Repository.prototype, 'update')

	const organizationPartial = Object.freeze({ name: 'my-org' })
	const organizationChanges = Object.freeze({ name: 'my-org-updated' })

	test('should fail when organization does not exist', async () => {
		expect.assertions(4)
		try {
			await service.update(organizationPartial, organizationChanges)
		} catch (error) {
			expect(findOrganizationSpy).toHaveBeenCalledWith(organizationPartial)
			expect(findOrganizationSpy).toHaveBeenCalledTimes(1)
			expect(updateOrganizationSpy).toHaveBeenCalledTimes(0)
			expect(error).toStrictEqual(new ResourceNotFoundError('Organization not found (name=my-org).'))
		}
	})

	test('should update organization', async () => {
		const organization = await context.manager.save(factories.organization(organizationPartial))
		const result = await service.update(organizationPartial, organizationChanges)
		expect(findOrganizationSpy).toHaveBeenCalledWith(organizationPartial)
		expect(findOrganizationSpy).toHaveBeenCalledTimes(1)
		expect(updateOrganizationSpy).toHaveBeenCalledWith(await getSpyResult(findOrganizationSpy), organizationChanges)
		expect(updateOrganizationSpy).toHaveBeenCalledTimes(1)
		expect(result).toMatchObject(expect.objectContaining({ ...organization, ...organizationChanges }))
	})

	test('should throw when name is already taken', async () => {
		const conflictingOrganizationPartial = { name: 'already-used' }
		await context.manager.save([
			factories.organization(organizationPartial),
			factories.organization(conflictingOrganizationPartial)
		])
		await expect(() => service.update(organizationPartial, conflictingOrganizationPartial)).rejects.toStrictEqual(
			new ConflictError('Name already taken.')
		)
	})
})

describe('Organization.delete()', () => {
	const findOrganizationSpy = jest.spyOn(Repository.prototype, 'findOneOrFail')
	const deleteOrganizationSpy = jest.spyOn(Repository.prototype, 'delete')

	const organizationPartial = Object.freeze({ name: 'my-org' })

	test('should fail when organization does not exist', async () => {
		expect.assertions(3)
		try {
			await service.delete(organizationPartial)
		} catch (error) {
			expect(findOrganizationSpy).toHaveBeenCalledWith(organizationPartial)
			expect(deleteOrganizationSpy).toHaveBeenCalledTimes(0)
			expect(error).toStrictEqual(new ResourceNotFoundError('Organization not found (name=my-org).'))
		}
	})

	test('should delete organization', async () => {
		await context.manager.save(factories.organization(organizationPartial))
		const result = await service.delete(organizationPartial)
		expect(findOrganizationSpy).toHaveBeenCalledWith(organizationPartial)
		expect(deleteOrganizationSpy).toHaveBeenCalledWith(await getSpyResult(findOrganizationSpy))
		expect(result).toBeInstanceOf(Organization)
		expect(result).toMatchObject(await getSpyResult(findOrganizationSpy))
	})
})

describe('OrganizationService.addMember()', () => {
	test('should return `OrganizationMember` record', async () => {
		const user = await context.manager.save(factories.user())
		const organization = await context.manager.save(factories.organization())
		expect(
			await service.addMember({ organizationId: organization.id, userId: user.id, role: 'developer' })
		).toBeInstanceOf(OrganizationMember)
	})

	test('should throw and error when user does not exists', async () => {
		const userId = randomUUID()
		const organization = await context.manager.save(factories.organization())
		await expect(() =>
			service.addMember({ organizationId: organization.id, userId, role: 'developer' })
		).rejects.toStrictEqual(new ResourceNotFoundError(`User:${userId} does not exists.`))
	})

	test('should throw and error when organization does not exists', async () => {
		const organizationId = randomUUID()
		const user = await context.manager.save(factories.user())
		await expect(() => service.addMember({ organizationId, userId: user.id, role: 'developer' })).rejects.toStrictEqual(
			new ResourceNotFoundError(`Organization:${organizationId} does not exists.`)
		)
	})

	test('should fail when user is already in organization', async () => {
		const user = await context.manager.save(factories.user())
		const organization = await context.manager.save(factories.organization())
		await context.manager.save(factories.organizationMember({ organization, user, role: 'developer' }))
		await expect(() =>
			service.addMember({ organizationId: organization.id, userId: user.id, role: 'developer' })
		).rejects.toStrictEqual(new ConflictError(`User:${user.id} is already member of Organization:${organization.id}.`))
	})

	test('should fail when ownership transfert is requested', async () => {
		const user = await context.manager.save(factories.user())
		const organization = await context.manager.save(factories.organization())
		await expect(() =>
			service.addMember({ organizationId: organization.id, userId: user.id, role: 'owner' })
		).rejects.toStrictEqual(new NotImplementedError(`Organization ownership transfer is not implemented.`))
	})
})

describe('OrganizationService.removeMember()', () => {
	test('should remove member', async () => {
		const { organization, organizationMember, user } = await createOrganizationMember()
		expect(await service.removeMember({ organizationId: organization.id, userId: user.id })).toMatchObject({
			organizationId: organization.id,
			role: organizationMember.role,
			userId: user.id
		})
		expect(
			await context.manager.findOneBy(OrganizationMember, { organizationId: organization.id, userId: user.id })
		).toBeNull()
	})

	test('should fail when user is organization owner', async () => {
		const user = await context.manager.save(factories.user())
		const organization = await context.manager.save(factories.organization())
		await context.manager.save(factories.organizationMember({ organization, user, role: 'owner' }))
		await expect(() =>
			service.removeMember({ organizationId: organization.id, userId: user.id })
		).rejects.toStrictEqual(new ConflictError(`You must transfer ownership of the organization before leaving it.`))
	})

	test('should return null when user is not member of organization', async () => {
		const user = await context.manager.save(factories.user())
		const organization = await context.manager.save(factories.organization())
		const result = await service.removeMember({ organizationId: organization.id, userId: user.id })
		expect(result).toBeNull()
	})
})
