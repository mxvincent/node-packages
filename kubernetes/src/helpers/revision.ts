import { Application, Environment } from '#/helpers/context'
import { getApplicationDirectory } from '#/helpers/misc'
import { readFileSync } from 'node:fs'

/**
 * You can use this map to pin version
 */
export const revisions: Map<Application, string | Map<Environment, string>> = new Map()

/**
 * Get last release number from application `package.json`
 */
const readPackageVersion = (application: Application): string => {
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
export const getRevision = (application: Application, environment: Environment): string => {
	const revision = revisions.get(application)
	if (typeof revision === 'string') {
		return revision
	}
	return revision?.get(environment) ?? readPackageVersion(application)
}
