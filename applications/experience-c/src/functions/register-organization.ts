import { context } from '#/core/context'
import { Organization } from '#/database/entities/Organization'
import { factories } from '#/database/factories'
import { logger } from '@mxvincent/telemetry'
import { times } from 'ramda'

export interface RegisterOrganizationsArgs {
	itemsCount: number
}
export async function registerOrganizations(parent: unknown, args: RegisterOrganizationsArgs) {
	const organizations: Organization[] = []
	const initialCount = await context.database.manager.count(Organization)
	let count = initialCount
	await context.database.transaction(async (manager) => {
		const batch = await manager.save(
			times(() => factories.organization({ name: `${String(count++).padStart(10, '0')}` }), args.itemsCount),
			{ chunk: 500 }
		)
		organizations.push(...batch)
	})

	logger.info(
		{
			created: count - initialCount,
			total: count
		},
		'Organizations created'
	)

	return organizations
}
