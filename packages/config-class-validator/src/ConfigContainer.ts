import { ConfigValidationError, getConfigFromEnvironment, getConfigFromFile } from '@mxvincent/config'
import { deepAssign } from '@mxvincent/core'
import { validateSync } from 'class-validator'
import { canUseEnv } from './UseEnv'
import { canUseFile } from './UseFile'

function initialize<T extends ConfigContainer<unknown>>(container: T) {
	if (canUseFile(container)) {
		deepAssign(container, getConfigFromFile(container.useFile()))
	}
	if (canUseEnv(container)) {
		deepAssign(container, getConfigFromEnvironment(container.useEnv()))
	}
	const errors = validateSync(container)
	if (errors.length) {
		throw new ConfigValidationError(`validation failed`, errors)
	}
	return Object.freeze(container)
}

export class ConfigContainer<T> {
	constructor(data?: Partial<T>) {
		Object.assign(this, data)
	}

	static initialize<T extends ConfigContainer<unknown>>(this: new () => T, data?: Partial<T>): T {
		return Object.assign(initialize(new this()), data)
	}
}
