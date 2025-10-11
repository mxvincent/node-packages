import { Organization } from '#/database/entities/Organization'
import { factories } from '#/database/factories'
import { listOrganizations } from '#/functions/list-organizations'
import { useTestingContext } from '#/jest/context'
import { times } from 'ramda'

const context = useTestingContext()

describe('list organizations', () => {
	let organizations: Organization[]
	beforeEach(async () => {
		organizations = await context.database.manager.save(
			Organization,
			times(() => factories.organization(), 50)
		)
	})
	test('should return all organizations', async () => {
		expect(await listOrganizations()).toStrictEqual(organizations)
	})
})
