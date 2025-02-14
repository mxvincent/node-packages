import { Application, Environment } from '#/helpers/context'
import { App as CDKScope } from 'cdk8s/lib/app'

const applicationScopes: Record<string, CDKScope> = {}
export const getApplicationScope = (application: Application): CDKScope => {
	return (applicationScopes[application] ??= new CDKScope({
		outdir: `manifests/${application}`,
		outputFileExtension: '.yaml'
	}))
}

const environmentScopes: Record<string, CDKScope> = {}
export const getEnvironmentScope = (environment: Environment): CDKScope => {
	return (environmentScopes[environment] ??= new CDKScope({
		outdir: `manifests/${environment}`,
		outputFileExtension: '.yaml'
	}))
}

export const synthesizeAllResources = () => {
	for (const applicationScope of Object.values(applicationScopes)) {
		applicationScope.synth()
	}
	for (const environmentScope of Object.values(environmentScopes)) {
		environmentScope.synth()
	}
}
