import { config } from '@app/config'
import { accountDataSource } from '@database/database.service'
import { Organization } from '@database/entities/Organization'
import { logger, setLogLevel } from '@mxvincent/logger'
import { initializeDataSource } from '@mxvincent/typeorm'

async function main(): Promise<void> {
	setLogLevel(config.logLevel)
	await initializeDataSource(accountDataSource, { runMigrations: false })
	const a = await accountDataSource.manager.find(Organization, { take: 3, relations: { members: true } })
	const q = accountDataSource
		.createQueryBuilder(Organization, 'o')
		.leftJoinAndSelect('o.members', 'm')
		.leftJoinAndSelect('m.user', 'u')
		.limit(3)
}

if (require.main === module) {
	main().catch((error) => {
		logger.fatal(error)
		process.exit(1)
	})
}
