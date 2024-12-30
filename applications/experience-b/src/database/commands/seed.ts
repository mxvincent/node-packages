import { schema } from '@/database/schema'
import { OrganizationMember } from '@/database/schemas/organization-members'
import { User } from '@/database/schemas/users'
import { database, postgresClient } from '@database/database'
import { factories } from '@database/factories'
import { organizationFactory } from '@database/factories/organization'
import { countRows } from '@database/helpers'
import { Organization } from '@database/schemas/organizations'
import { randomArrayItem, TextSequence } from '@mxvincent/core'
import { logger } from '@mxvincent/telemetry'
import { randomInt } from 'crypto'
import { PgTable } from 'drizzle-orm/pg-core'
import { PgInsertValue } from 'drizzle-orm/pg-core/query-builders/insert'
import { splitEvery, times } from 'ramda'

const reportPerformance = (mark: string, message: string, ...rest: unknown[]) => {
	const time = new Date().toLocaleTimeString()
	const duration = (performance.measure(mark, mark).duration / 1000).toFixed(3)
	logger.debug(`(${time}) ${message} (${duration}s)`, ...rest)
}

const sequences = {
	users: new TextSequence('user', await countRows(schema.user)),
	organizations: new TextSequence('organization', await countRows(schema.organization))
}

const insert = async <TableType extends PgTable, DataType extends PgInsertValue<TableType>>(
	table: TableType,
	values: DataType[]
) => {
	await Promise.all(splitEvery(5_000, values).map((chunkValues) => database.insert(table).values(chunkValues)))
	return values
}

const createUsers = times(() => factories.user({ username: sequences.users.next() }))
const createOrganizations = times(() => organizationFactory({ name: sequences.organizations.next() }))

const createOrganizationMember = (data: { organizations: Organization[]; users: User[] }): OrganizationMember[] => {
	return data.organizations.flatMap((organization: Organization) => {
		const members = new WeakSet<User>()
		const getUser = (): User => {
			const user = randomArrayItem(data.users)
			if (members.has(user)) {
				return getUser()
			}
			members.add(user)
			return user
		}
		return [
			...times(() => 'owner', 1),
			...times(() => 'admin', randomInt(0, 11)),
			...times(() => 'reviewer', randomInt(0, 21)),
			...times(() => 'developer', randomInt(0, 101))
		].map((role) => {
			return factories.organizationMember({
				organization,
				user: getUser(),
				role
			})
		})
	})
}

enum Mark {
	start = 'START',
	createUsers = 'CREATE_USER',
	createOrganizations = 'CREATE_ORGANIZATION',
	createOrganizationMembers = 'CREATE_ORGANIZATION_MEMBER'
}

async function seed(chunkId: number) {
	performance.mark(Mark.createUsers)
	const users = await insert(schema.user, createUsers(50_000))
	reportPerformance(Mark.createUsers, `[#${chunkId}] ${users.length} users created`)

	performance.mark(Mark.createOrganizations)
	const organizations = await insert(schema.organization, createOrganizations(10_000))
	reportPerformance(Mark.createOrganizations, `[#${chunkId}] ${organizations.length} organizations created`)

	performance.mark(Mark.createOrganizationMembers)
	const organizationMembers = await insert(
		schema.organizationMember,
		createOrganizationMember({ organizations, users })
	)
	reportPerformance(
		Mark.createOrganizationMembers,
		`[#${chunkId}] ${organizationMembers.length} organization members created`
	)

	return {
		organizations: organizations.length,
		organizationMembers: organizationMembers.length,
		users: users.length
	}
}

try {
	performance.mark(Mark.start)
	for (let i = 0; i < 20; i++) {
		await seed(i)
	}
	reportPerformance(Mark.start, 'Seed operation completed', {
		organizations: sequences.organizations.value,
		users: sequences.users.value,
		organizationMember: await countRows(schema.organizationMember)
	})
} catch (error) {
	console.error(error)
} finally {
	await postgresClient.end()
	await process.exit(0)
}
