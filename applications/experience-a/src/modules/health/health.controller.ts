import { Controller, Get, Inject } from '@nestjs/common'
import { HealthCheckService } from './health.service'

@Controller()
export class HealthController {
	constructor(@Inject(HealthCheckService) readonly service: HealthCheckService) {}
	@Get('/healthz')
	async livenessProbe() {
		return this.service.getStatus()
	}
}
