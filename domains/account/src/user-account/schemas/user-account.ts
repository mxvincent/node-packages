import { TimestampedResource } from '@package/incubator'

export class UserAccount extends TimestampedResource {
	declare email: string
	declare username: string
}
