export type QueryParameterParserOptions = {
	filterable: string[]
	sortable: string[]
	pagination: {
		defaultSize: number
		maxSize: number
	}
}
