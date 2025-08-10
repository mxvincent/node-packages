import { config } from '#/core/config'
import { Organization, OrganizationAttributes } from '#/database/entities/Organization'
import { OrganizationMember, OrganizationMemberProperties } from '#/database/entities/OrganizationMember'
import { User, UserProperties } from '#/database/entities/User'
import { faker } from '@faker-js/faker'
import { Alphabet, randomArrayItem, randomString } from '@mxvincent/core'
import { logger } from '@mxvincent/telemetry'
import { DataSource, EntityManager, ObjectType } from '@mxvincent/typeorm'
import { randomInt } from 'crypto'
import process from 'node:process'
import { range } from 'ramda'

const startingTime = Date.now()

const info = (message: string, data: Record<string, unknown> = {}) => {
	logger.info(
		{
			heap: `${(process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(3)}MB`,
			...data
		},
		`(${(Date.now() - startingTime) / 1000}s) ${message}`
	)
}

const truncateTable = (manager: EntityManager, table: string) => {
	info(`truncate ${table}`)
	return manager.query(`TRUNCATE TABLE "${config.database.schema}"."${table}" CASCADE`)
}

const base62RandomString = randomString(Alphabet.BASE_62, 8)

const CHUNK_SIZE = 100

const counts = new Map<string, number>()

async function createRecords<T>(options: {
	manager: EntityManager
	entity: ObjectType<T>
	count: number
	factory: (n: number) => Partial<T>
	name: string
}): Promise<string[]> {
	const globalCount = counts.get(options.name) ?? 0
	const start = Date.now()
	const queries = []
	let chunkFirstIndex = 0
	let chunkLastIndex = 0
	while (chunkLastIndex < options.count) {
		const upperLimit = chunkFirstIndex + CHUNK_SIZE
		chunkLastIndex = upperLimit > options.count ? options.count : upperLimit
		const records = range(globalCount + chunkFirstIndex, globalCount + chunkLastIndex).map(options.factory)
		queries.push(options.manager.insert(options.entity, records as never))
		chunkFirstIndex = chunkLastIndex
	}
	const results = await Promise.all(queries)
	const ids = results.flatMap((result) => result.identifiers.map((el) => el.id))
	counts.set(options.name, globalCount + ids.length)
	logger.debug(`create ${ids.length} ${options.name} in ${(Date.now() - start) / 1000}s`)
	return ids
}

async function createUsers(manager: EntityManager, count: number): Promise<string[]> {
	const factory = (): Omit<UserProperties, 'id'> => {
		const gender = faker.person.sex() as 'female' | 'male'
		const username = base62RandomString(16)
		const createdAt = faker.date.between({ from: new Date('2020-01-01T00:00:00Z'), to: new Date() })
		return {
			username,
			email: `${username}@lab.ovh`,
			firstName: faker.person.firstName(gender),
			lastName: faker.person.firstName(gender),
			createdAt,
			updatedAt: createdAt,
			deletedAt: null
		}
	}
	return createRecords({ count, manager, entity: User, factory, name: 'users' })
}

async function createOrganizations(manager: EntityManager, count: number): Promise<string[]> {
	const factory = (): Omit<OrganizationAttributes, 'id'> => {
		const name = `${base62RandomString(16)}`
		const createdAt = faker.date.between({ from: new Date('2020-01-01T00:00:00Z'), to: new Date() })
		return { name, createdAt, updatedAt: createdAt, deletedAt: null }
	}
	return createRecords({ count, manager, entity: Organization, factory, name: 'organizations' })
}

async function createOrganizationMembers(manager: EntityManager, organizationIds: string[], userIds: string[]) {
	const start = Date.now()
	let count = 0
	let members: OrganizationMemberProperties[] = []
	const promises: Promise<unknown>[] = []
	const flushMembers = () => {
		promises.push(manager.insert(OrganizationMember, members))
		members = []
	}
	for (const organizationId of organizationIds) {
		const organizationMembers: OrganizationMemberProperties[] = []
		const getUserId = (): string => {
			const userId = randomArrayItem(userIds)
			return organizationMembers.find((member) => member.userId === userId) ? getUserId() : userId
		}
		const addMember = (member: OrganizationMemberProperties) => {
			count++
			members.push(member)
			organizationMembers.push(member)
		}
		addMember({ role: 'owner', organizationId, userId: randomArrayItem(userIds) })
		for (let i = 0; i < randomInt(0, 11); i++) {
			addMember({ role: 'admin', organizationId, userId: getUserId() })
		}
		for (let i = 0; i < randomInt(0, 101); i++) {
			addMember({ role: 'developer', organizationId, userId: getUserId() })
		}
		if (members.length > 1000) {
			flushMembers()
		}
	}
	flushMembers()
	await Promise.all(promises)
	logger.debug(`create ${count} organization members in ${(Date.now() - start) / 1_000}s`)
}

export async function seedAccountDatabase(dataSource: DataSource) {
	const start = Date.now()
	await truncateTable(dataSource.manager, 'OrganizationMember')
	await truncateTable(dataSource.manager, 'Organization')
	await truncateTable(dataSource.manager, 'User')
	const batchCount = 200
	for (let i = 1; i <= batchCount; i++) {
		logger.info(`create resources batch ${i}/${batchCount}`)
		const organizationIds = await createOrganizations(dataSource.manager, 1_000)
		const userIds = await createUsers(dataSource.manager, 5_000)
		await createOrganizationMembers(dataSource.manager, organizationIds, userIds)
	}
	logger.info(
		{
			user: await dataSource.manager.count(User),
			organization: await dataSource.manager.count(Organization),
			organizationMembers: await dataSource.manager.count(OrganizationMember)
		},
		`resources created (${(Date.now() - start) / 1_000}s)`
	)
}
