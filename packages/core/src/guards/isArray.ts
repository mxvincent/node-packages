export const isArray = <T = any>(value: unknown): value is T[] => {
	return Array.isArray(value)
}
