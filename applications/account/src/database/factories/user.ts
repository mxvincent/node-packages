import { User } from '#/database/schemas/users'
import { generateResource } from '@package/incubator'

export const userFactory = (options: { username: string }): User => {
	return {
		...generateResource(),
		username: options.username,
		email: `${options.username}@lab.ovh`
	}
}
