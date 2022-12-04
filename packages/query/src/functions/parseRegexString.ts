export interface ParsedRegexOperator {
	pattern: string
	flags?: string
}

export const parseRegexString = (input: string): ParsedRegexOperator => {
	if (input.charAt(0) !== '/') {
		return { pattern: input }
	}
	const delimiterIndex = input.lastIndexOf('/')
	if (!delimiterIndex) {
		throw new Error('regex pattern ending delimiter not found')
	}
	const pattern = input.slice(1, delimiterIndex)
	const flags = input.slice(delimiterIndex + 1)
	if (!flags.length) {
		return { pattern }
	}
	return { pattern, flags }
}
