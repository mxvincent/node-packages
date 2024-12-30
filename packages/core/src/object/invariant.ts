export function invariant<T>(value: T | undefined, message: string = 'Value can not be undefined.'): T {
	if (!value) {
		throw new TypeError(message)
	}
	return value
}
