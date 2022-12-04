import { EnvironmentVariableMapping, getConfigFromEnvironment } from './getConfigFromEnvironment'

beforeAll(() => {
	Object.assign(process.env, {
		A: 'value',
		B: 'value'
	})
})

it.each([
	{ input: {}, output: {} },
	{ input: { a: 'A' }, output: { a: 'value' } },
	{ input: { a: { b: 'B' } }, output: { a: { b: 'value' } } }
])('should return configuration object', ({ input, output }) => {
	expect(getConfigFromEnvironment(input as EnvironmentVariableMapping)).toEqual(output)
})
