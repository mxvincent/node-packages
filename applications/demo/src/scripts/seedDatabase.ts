import { faker } from '@faker-js/faker'
import { getLogger } from '@mxvincent/core'
import { randomInt } from 'crypto'
import { range } from 'ramda'
import { ObjectType } from 'typeorm'
import { closeAllDatabaseConnections, database, initializeDataSource } from '../database'
import { Organization } from '../database/entities/Organization'
import { OrganizationMember } from '../database/entities/OrganizationMember'
import { User } from '../database/entities/User'

const logger = getLogger()

const truncateTable = (table: string) => {
	return database.manager.query(`truncate table "${table}" cascade`)
}

const getRandomItem = <T>(array: T[]): T => {
	return array[Math.floor(Math.random() * array.length)]
}

const chunkSize = 100

async function createRecords<T>(options: {
	entity: ObjectType<T>
	count: number
	factory: (n: number) => Partial<T>
	name: string
}): Promise<string[]> {
	const start = Date.now()
	const queries = []
	let chunkFirstIndex = 0
	let chunkLastIndex = 0
	while (chunkLastIndex < options.count) {
		const upperLimit = chunkFirstIndex + chunkSize
		chunkLastIndex = upperLimit > options.count ? options.count : upperLimit
		const records = range(chunkFirstIndex, chunkLastIndex).map(options.factory)
		queries.push(database.manager.insert(options.entity, records))
		chunkFirstIndex = chunkLastIndex
	}
	const results = await Promise.all(queries)
	const ids = results.flatMap((result) => result.identifiers.map((el) => el.id))
	logger.info(`create ${options.count} ${options.name} in ${(Date.now() - start) / 1000}s`)
	return ids
}

async function createUsers(count: number): Promise<string[]> {
	const factory = (n: number) => {
		const username = `user-${String(n).padStart(8, '0')}`
		const gender = faker.name.sex() as 'female' | 'male'
		return {
			username,
			email: `${username}@lab.ovh`,
			firstName: faker.name.firstName(gender),
			lastName: faker.name.firstName(gender)
		}
	}
	return createRecords({ count, entity: User, factory, name: 'users' })
}

async function createOrganizations(count: number): Promise<string[]> {
	const factory = (n: number) => {
		return { name: `organization-${String(n).padStart(8, '0')}` }
	}
	return createRecords({ count, entity: Organization, factory, name: 'organizations' })
}

async function createOrganizationMembers(organizationIds: string[], userIds: string[]) {
	const start = Date.now()
	let count = 0
	for (const organizationId of organizationIds) {
		const members: Partial<OrganizationMember>[] = [
			{
				role: 'owner',
				organizationId,
				userId: getRandomItem(userIds)
			}
		]
		const getUserId = (): string => {
			const userId = getRandomItem(userIds)
			return members.find((member) => member.userId === userId) ? getUserId() : userId
		}
		for (let i = 0; i < randomInt(0, 11); i++) {
			members.push({ role: 'admin', organizationId, userId: getUserId() })
		}
		for (let i = 0; i < randomInt(0, 101); i++) {
			members.push({ role: 'developer', organizationId, userId: getUserId() })
		}
		count += members.length
		await database.manager.getRepository(OrganizationMember).insert(members)
	}
	logger.info(`create ${count} organization members in ${(Date.now() - start) / 1000}s`)
}

async function main() {
	await initializeDataSource(database)
	await truncateTable('OrganizationMember')
	await truncateTable('Organization')
	await truncateTable('User')
	const userIds = await createUsers(1000000)
	const organizationIds = await createOrganizations(200000)
	await createOrganizationMembers(organizationIds, userIds)
}

main()
	.then(() => process.exit(0))
	.catch(async (error) => {
		logger.error(error)
		await closeAllDatabaseConnections(database)
		process.exit(1)
	})
