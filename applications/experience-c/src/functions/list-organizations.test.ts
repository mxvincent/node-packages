import { Organization } from '#/database/entities/Organization'
import { factories } from '#/database/factories'
import { listOrganizations } from '#/functions/list-organizations'
import { useTestingContext } from '#/jest/context'
import { times } from 'es-toolkit/compat'

const context = useTestingContext()

describe('list organizations', () => {
	let organizations: Organization[]
	beforeEach(async () => {
		organizations = await context.database.manager.save(
			Organization,
			times(50, () => factories.organization())
		)
	})
	test('should return all organizations', async () => {
		expect(await listOrganizations()).toStrictEqual(organizations)
	})
})
