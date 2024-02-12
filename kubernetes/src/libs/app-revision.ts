import { Application, Environment } from '@libs/app-context'

import { existsSync, readFileSync } from 'node:fs'
import { dirname } from 'path'
import { identity, memoizeWith } from 'ramda'

/**
 * You can use this map to pin version
 */
export const versions: Map<Application, string | Map<Environment, string>> = new Map()

export const getApplicationDirectory = memoizeWith(identity, (path: string): string => {
	if (path === '/') {
		throw new Error('Failed to find repository root dir')
	}
	if (existsSync(`${path}/pnpm-workspace.yaml`)) {
		return `${path}/applications`
	}
	return getApplicationDirectory(dirname(path))
})

/**
 * Get last release number from application `package.json`
 */
const getLastReleaseVersion = (application: Application): string => {
	const packageJsonPath = `${getApplicationDirectory(__filename)}/${application}/package.json`
	const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
	if (packageJson?.version) {
		return packageJson.version
	}
	throw new Error(`Failed to load revision from ${packageJsonPath}`)
}

/**
 * Get target revision for an application
 */
export const getRevision = (application: Application, environment: Environment) => {
	const pin = versions.get(application)
	if (typeof pin === 'string') {
		return pin
	}
	if (pin?.has(environment)) {
		return pin.get(environment)
	}
	return getLastReleaseVersion(application)
}
