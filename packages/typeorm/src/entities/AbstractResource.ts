/**
 * Abstract type for basic entities
 */
export abstract class AbstractResource<T> {
	constructor(data?: Partial<T>) {
		if (data) {
			Object.assign(this, data)
		}
	}
}
