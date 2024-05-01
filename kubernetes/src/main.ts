import { DemoGraphql } from '@charts/demo-graphql'
import { Context } from '@libs/context'
import { synthesizeAllResources } from '@libs/environment'

/**
 * Demo graphql
 */
new DemoGraphql(new Context('staging', 'demo-graphql'))
new DemoGraphql(new Context('production', 'demo-graphql'))

synthesizeAllResources()
