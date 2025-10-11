import { Database } from '#/database/database.service'
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common'

export type ServiceStatus = {
	status: 'ok'
	details: {
		database: 'connected'
	}
}

@Injectable()
export class HealthCheckService {
	readonly logger = new Logger(HealthCheckService.name)

	constructor(readonly database: Database) {}

	async getStatus(): Promise<ServiceStatus> {
		return {
			status: 'ok',
			details: {
				database: await this.getDatabaseStatus()
			}
		}
	}

	private async getDatabaseStatus(): Promise<ServiceStatus['details']['database']> {
		try {
			await this.database.query(`SELECT 1`)
			return 'connected'
		} catch (error) {
			throw new ServiceUnavailableException('Database is not available.', {
				cause: error as Error
			})
		}
	}
}
