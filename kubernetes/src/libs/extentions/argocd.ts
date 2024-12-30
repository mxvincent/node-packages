export enum ArgoCDAnnotation {
	HOOK = 'argocd.argoproj.io/hook',
	HOOK_DELETE_POLICY = 'argocd.argoproj.io/hook-delete-policy',
	SYNC_OPTIONS = 'argocd.argoproj.io/sync-options'
}

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
