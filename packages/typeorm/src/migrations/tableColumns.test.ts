import { resource, softDeletableResource } from './tableColumns'

const resourceColumns = [
	{
		default: 'uuid_generate_v4()',
		isPrimary: true,
		name: 'id',
		type: 'uuid'
	},
	{
		default: 'now()',
		name: 'createdAt',
		precision: 3,
		type: 'timestamp with time zone'
	},
	{
		default: 'now()',
		name: 'updatedAt',
		precision: 3,
		type: 'timestamp with time zone'
	}
]

describe('resource', () => {
	test('should return default columns array', async () => {
		expect(resource([])).toEqual(resourceColumns)
	})
	test('should return extended columns array', async () => {
		expect(resource([{ name: 'price', type: 'int' }])).toEqual([...resourceColumns, { name: 'price', type: 'int' }])
	})
})

describe('resource with soft delete', () => {
	test('should return extended columns array', async () => {
		expect(softDeletableResource([])).toEqual([
			...resourceColumns,
			{ name: 'deletedAt', precision: 3, type: 'timestamp with time zone', isNullable: true }
		])
	})
})
