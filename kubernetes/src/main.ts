import { DemoGraphql } from '@charts/demo-graphql'
import { Context } from '@libs/context'
import { synthesizeAllResources } from '@libs/environment'

new DemoGraphql(new Context('development', 'demo-graphql'))

new DemoGraphql(new Context('production', 'demo-graphql'))

synthesizeAllResources()
