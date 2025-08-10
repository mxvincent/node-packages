export interface HttpRequestInfo {
	id: string
	method: string
	path: string
	params: unknown
	headers: Record<string, unknown>
}
