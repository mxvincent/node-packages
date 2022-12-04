import { timestampzOptions } from './columnOptions'

describe('get timestampz column options', () => {
	test('with default precision', async () => {
		expect(timestampzOptions({ name: 'createdAt' })).toEqual({
			name: 'createdAt',
			type: 'timestamp with time zone',
			precision: 3
		})
	})
	test('with precision override', async () => {
		expect(timestampzOptions({ name: 'createdAt', precision: 6 })).toEqual({
			name: 'createdAt',
			type: 'timestamp with time zone',
			precision: 6
		})
	})
})
