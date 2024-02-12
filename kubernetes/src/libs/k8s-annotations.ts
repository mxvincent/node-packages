// ArgoCD hooks
export const ANNOTATION_ARGOCD_HOOK = 'argocd.argoproj.io/hook'
export const ANNOTATION_ARGOCD_HOOK_DELETE_POLICY = 'argocd.argoproj.io/hook-delete-policy'
export const ANNOTATION_ARGOCD_SYNC_OPTIONS = 'argocd.argoproj.io/sync-options'

// Stakater application reloader
export const ANNOTATION_RELOAD_ON_CONFIGMAP_CHANGE = 'configmap.reloader.stakater.com/reload'
export const ANNOTATION_RELOAD_ON_SECRET_CHANGE = 'secret.reloader.stakater.com/reload'

// Cert manager
export const ANNOTATION_CERT_ISSUER = 'cert-manager.io/cluster-issuer'

// Ingress controller
export const ANNOTATION_PROXY_BODY_SIZE = 'nginx.ingress.kubernetes.io/proxy-body-size'
export const ANNOTATION_SSL_REDIRECT = 'ingress.kubernetes.io/ssl-redirect'
