import { generateParameterName } from './generateParameterName'

test('should return 8 base62 chars', async () => {
	expect(generateParameterName()).toMatch(/[a-zA-Z0-9]{8}/)
})

test('should return 12 base62 chars', async () => {
	expect(generateParameterName(12)).toMatch(/[a-zA-Z0-9]{12}/)
})
