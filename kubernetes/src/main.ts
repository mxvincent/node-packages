import { DemoGraphql } from '@charts/demo-graphql'
import { ApplicationContext } from '@libs/application-context'
import { synthesizeAllResources } from '@libs/environment'
import { inspect } from 'node:util'

const production: ApplicationContext[] = [new ApplicationContext('production', 'demo-graphql')]

for (const context of [...production]) {
	const chart = new DemoGraphql(context)
	console.log(inspect(chart.context.environment, { colors: true, depth: 10 }))
}

synthesizeAllResources()
