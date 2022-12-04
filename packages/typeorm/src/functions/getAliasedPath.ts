/**
 * Return path if already prefixed or use fallback alias as prefix
 */
export const getAliasedPath = (path: string, fallbackAlias: string) => {
	return path.includes('.') ? path : `${fallbackAlias}.${path}`
}
