import { database, factories, User } from '../@jest/database'

async function main() {
	await database.initialize()
	await database.manager.insert(User, factories.createUsers(20))
}

main()
	.then(() => process.exit())
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
