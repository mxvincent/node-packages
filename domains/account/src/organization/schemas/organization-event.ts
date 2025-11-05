import { TimestampedResource } from '@package/incubator'

export enum OrganizationEventName {
	MEMBER_JOINED = 'member-joined',
	MEMBER_LEFT = 'member-left',
	ORGANIZATION_CREATED = 'organization-created'
}

export class OrganizationEvent extends TimestampedResource {
	declare name: OrganizationEventName
	payload: unknown // TBD
}
