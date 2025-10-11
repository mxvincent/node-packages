import { generateResource } from '#/database/helpers/factories'
import { User } from '#/database/schemas/users'

export const userFactory = (options: { username: string }): User => {
	return {
		...generateResource(),
		username: options.username,
		email: `${options.username}@lab.ovh`
	}
}
