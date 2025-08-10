import { DatabaseModule } from '#/database/database.module'
import { Module } from '@nestjs/common'
import { HealthController } from './health.controller'
import { HealthCheckService } from './health.service'

@Module({
	imports: [DatabaseModule],
	controllers: [HealthController],
	providers: [HealthCheckService]
})
export class HealthModule {}
