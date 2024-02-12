import { Environment } from '@libs/app-context'
import { App as CDKScope } from 'cdk8s'

export const ARGOCD_OUTPUT_FILE_EXTENSION = '.yaml'

export enum ArgocdHook {
	PostSync = 'PostSync',
	PreSync = 'PreSync',
	Skip = 'Skip',
	Sync = 'Sync',
	SyncFail = 'SyncFail'
}

export enum ArgocdHookDeletePolicy {
	BeforeHookCreation = 'BeforeHookCreation',
	HookFailed = 'HookFailed',
	HookSucceeded = 'HookSucceeded'
}

const scopes = new Map<Environment, CDKScope>()
export const getEnvironmentScope = (environment: Environment): CDKScope =>
	scopes.get(environment) ??
	(() => {
		const scope = new CDKScope({
			outdir: `manifests/${environment}`,
			outputFileExtension: ARGOCD_OUTPUT_FILE_EXTENSION
		})
		scopes.set(environment, scope)
		return scope
	})()

export const synthesizeAllResources = () => {
	for (const environmentScope of scopes.values()) {
		environmentScope.synth()
	}
}
