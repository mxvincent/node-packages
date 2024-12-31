import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { config } from '@app/config'
import { HealthModule } from '@module/health/health.module'
import { OrganizationModule } from '@module/organization/organization.module'
import { UserModule } from '@module/user/user.module'
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
			autoSchemaFile: config.environment !== Environment.PRODUCTION ? 'schema.gql' : true,
			playground: false,
			plugins: config.environment !== Environment.PRODUCTION ? [ApolloServerPluginLandingPageLocalDefault()] : []
		})
	]
})
export class AppModule {}
