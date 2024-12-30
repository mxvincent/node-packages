import * as core from '@actions/core'
import { inspect } from 'node:util'
import { getPublishedPackages, listApplications } from './context'

const applications = listApplications()

const publishedPackages = getPublishedPackages()

const publishedApplications = publishedPackages
	.filter((pkg) => applications.find((appName) => appName === pkg.name))
	.map((pkg) => ({
		application: pkg.name,
		image: `ghcr.io/mxvincent/${pkg.name}`,
		version: pkg.version
	}))

const buildMatrix = {
	include: publishedApplications
}

core.setOutput('docker-build-matrix', buildMatrix)

console.log('docker-build-matrix', inspect(buildMatrix, { depth: 10 }))
