import { database, postgresClient } from '#/database/client'
import { factories } from '#/database/factories'
import { countRows } from '#/database/helpers'
import { tables } from '#/database/schema'
import { OrganizationMember } from '#/database/schemas/organization-members'
import { Organization } from '#/database/schemas/organizations'
import { User } from '#/database/schemas/users'
import { randomArrayItem, TextSequence } from '@mxvincent/core'
import { logger, serializers } from '@mxvincent/telemetry'
import { randomInt } from 'crypto'
import { PgTable } from 'drizzle-orm/pg-core'
import { PgInsertValue } from 'drizzle-orm/pg-core/query-builders/insert'
import { splitEvery, times } from 'ramda'

const reportPerformance = (mark: string, message: string, context: Record<string, unknown> = {}) => {
	const time = new Date().toLocaleTimeString()
	const duration = (performance.measure(mark, mark).duration / 1000).toFixed(3)
	logger.debug({ context }, `(${time}) ${message} (${duration}s)`)
}

const insert = async <TableType extends PgTable, DataType extends PgInsertValue<TableType>>(
	table: TableType,
	values: DataType[]
) => {
	await Promise.all(splitEvery(5_000, values).map((chunkValues) => database.insert(table).values(chunkValues)))
	return values
}

const populateOrganization = (data: { organizations: Organization[]; users: User[] }): OrganizationMember[] => {
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

const main = async () => {
	performance.mark(Mark.start)

	const sequences = {
		users: new TextSequence('user', await countRows(tables.user)),
		organizations: new TextSequence('organization', await countRows(tables.organization))
	}

	const createUsers = times(() => factories.user({ username: sequences.users.next() }))
	const createOrganizations = times(() => factories.organization({ name: sequences.organizations.next() }))

	const seed = async (chunkId: number) => {
		performance.mark(Mark.createUsers)
		const users = await insert(tables.user, createUsers(10_000))
		reportPerformance(Mark.createUsers, `[#${chunkId}] ${users.length} users created`)

		performance.mark(Mark.createOrganizations)
		const organizations = await insert(tables.organization, createOrganizations(2_000))
		reportPerformance(Mark.createOrganizations, `[#${chunkId}] ${organizations.length} organizations created`)

		performance.mark(Mark.createOrganizationMembers)
		const organizationMembers = await insert(tables.organizationMember, populateOrganization({ organizations, users }))
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

	for (let i = 0; i < 8; i++) {
		await seed(i)
	}
	reportPerformance(Mark.start, 'Seed operation completed', {
		organizations: sequences.organizations.value,
		users: sequences.users.value,
		organizationMember: await countRows(tables.organizationMember)
	})
}

main()
	.catch((error) => logger.fatal({ error: serializers.error(error) }))
	.finally(() => postgresClient.end())
