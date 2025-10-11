import { Organization } from '#/database/entities/Organization'
import { OrganizationMember } from '#/database/entities/OrganizationMember'
import { User } from '#/database/entities/User'
import { ConflictErrorFilter, NotFoundErrorFilter } from '#/filters/errors.filter'
import { GQLUser } from '#/modules/user/user.schema'
import { UserService } from '#/modules/user/user.service'
import { GQLConflictError } from '#/schemas/errors.schema'
import { UseFilters } from '@nestjs/common'
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import {
	GQLAddOrganizationMemberInput,
	GQLAddOrganizationMemberResult,
	GQLOrganizationMember,
	GQLOrganizationMemberWhere,
	GQLRemoveOrganizationMemberResult
} from './organization-member.schema'
import { GQLOrganization } from './organization.schema'
import { OrganizationService } from './organization.service'

@Resolver(() => GQLOrganizationMember)
@UseFilters(ConflictErrorFilter, NotFoundErrorFilter)
export class OrganizationMemberResolver {
	constructor(
		readonly organizationService: OrganizationService,
		readonly userService: UserService
	) {}

	@ResolveField(() => GQLOrganization)
	async organization(@Parent() member: OrganizationMember): Promise<Organization> {
		return member.organization ?? (await this.organizationService.findOneOrFail({ id: member.organizationId }))
	}

	@ResolveField(() => GQLUser)
	async user(@Parent() member: OrganizationMember): Promise<User> {
		return member.user ?? (await this.userService.findOneOrFail({ id: member.userId }))
	}

	@Mutation(() => GQLAddOrganizationMemberResult)
	@UseFilters(NotFoundErrorFilter)
	async addOrganizationMember(
		@Args('input', { type: () => GQLAddOrganizationMemberInput }) input: GQLAddOrganizationMemberInput
	): Promise<OrganizationMember | GQLConflictError> {
		return await this.organizationService.addMember(input)
	}

	@Mutation(() => GQLRemoveOrganizationMemberResult, { nullable: true })
	async removeOrganizationMember(
		@Args('where', { type: () => GQLOrganizationMemberWhere }) where: GQLOrganizationMemberWhere
	): Promise<OrganizationMember | null> {
		return await this.organizationService.removeMember(where)
	}
}
