import { config } from '#/core/config.service'
import { HealthModule } from '#/modules/health/health.module'
import { OrganizationModule } from '#/modules/organization/organization.module'
import { UserModule } from '#/modules/user/user.module'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { Environment } from '@mxvincent/core'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { LoggerModule } from 'nestjs-pino'

@Module({
	imports: [
		LoggerModule.forRoot({
			pinoHttp: {
				transport: {
					target: 'pino-pretty',
					options: {
						singleLine: true
					}
				}
			}
		}),
		OrganizationModule,
		UserModule,
		HealthModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: config.app.environment !== Environment.PRODUCTION ? 'schema.gql' : true,
			playground: false,
			plugins: config.app.environment !== Environment.PRODUCTION ? [ApolloServerPluginLandingPageLocalDefault()] : []
		})
	]
})
export class AppModule {}
