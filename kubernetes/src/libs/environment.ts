import { App as CDKScope } from 'cdk8s/lib/app'

export const environments = ['development', 'production', 'staging'] as const
export type Environment = (typeof environments)[number]

const scopes: Record<string, CDKScope> = {}

export const synthesizeAllResources = () => {
	for (const environmentScope of Object.values(scopes)) {
		environmentScope.synth()
	}
}

export const getEnvironmentScope = (environment: Environment): CDKScope => {
	return (scopes[environment] ??= new CDKScope({
		outdir: `manifests/${environment}`,
		outputFileExtension: '.yaml'
	}))
}
