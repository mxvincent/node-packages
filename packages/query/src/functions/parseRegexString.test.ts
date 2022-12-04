import { parseRegexString } from './parseRegexString'

test.each([
	['abc', { pattern: 'abc' }],
	['/abc/', { pattern: 'abc' }],
	['/abc/i', { pattern: 'abc', flags: 'i' }]
])('should parse regex string', (input, output) => {
	expect(parseRegexString(input)).toEqual(output)
})
