import { DemoGraphql } from '@charts/demo-graphql.chart'
import { AppContext, environments } from '@libs/app-context'
import { synthesizeAllResources } from '@libs/argocd'

for (const environment of environments) {
	new DemoGraphql(new AppContext('demo-graphql', environment))
}

synthesizeAllResources()
