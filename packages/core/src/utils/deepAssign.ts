import { is } from 'ramda'

export const deepAssign = <T extends Record<string, any>>(container: T, overlay: Record<string, any>): T => {
	for (const [key, value] of Object.entries(overlay)) {
		if (is(Object, value)) {
			Object.assign(container[key], deepAssign(container[key], value))
		} else {
			Object.assign(container, { [key]: value })
		}
	}
	return container
}
