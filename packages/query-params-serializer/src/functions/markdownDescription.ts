import { QueryParameterParserOptions } from '../types/QueryParameterParserOptions'

// prettier-ignore
const header = (header?: string) => (header ? `## ${header}\n` : '')

// prettier-ignore
const description = (description?: string) => (description ? `${description}\n` : '')

// prettier-ignore
const query = (query?: QueryParameterParserOptions) => query ? `
---
**Items per page:** default: ${query.defaultPageSize}, max: ${query.maxPageSize}\n
**Supported filters:** ${query.filterable.sort().join(', ')}\n
**Supported sorts:** ${query.sortable.sort().join(', ')}\n
` : ''

export const markdownDescription = (options: {
	header: string
	description?: string
	query?: QueryParameterParserOptions
}): string => header(options.header) + description(options.description) + query(options.query)
