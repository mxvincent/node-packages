import { Database } from '#/database/database.service'
import { Organization, OrganizationAttributes, OrganizationUniqueProperties } from '#/database/entities/Organization'
import {
	OrganizationMember,
	OrganizationMemberProperties,
	OrganizationMemberUniqueProperties
} from '#/database/entities/OrganizationMember'
import { User } from '#/database/entities/User'
import { ConflictError, NotImplementedError } from '@mxvincent/core'
import { GQLConnection, ListQueryParameter } from '@mxvincent/query-params'
import { DeletableResource, Not } from '@mxvincent/typeorm'
import { Injectable } from '@nestjs/common'

export type CreateOrganizationPayload = Omit<OrganizationAttributes, keyof DeletableResource>
export type UpdateOrganizationPayload = Partial<CreateOrganizationPayload>

@Injectable()
export class OrganizationService {
	constructor(protected database: Database) {
		this.database = database
	}

	async getConnection(options: ListQueryParameter): Promise<GQLConnection<Organization>> {
		const organizations = this.database.repository(Organization)
		return organizations.getConnection(options)
	}

	async findOne(where: OrganizationUniqueProperties): Promise<Organization | null> {
		const organizations = this.database.repository(Organization)
		return organizations.findOne(where)
	}

	async findOneOrFail(where: OrganizationUniqueProperties): Promise<Organization> {
		const organizations = this.database.repository(Organization)
		return organizations.findOneOrFail(where)
	}

	async create(payload: CreateOrganizationPayload): Promise<Organization> {
		const organizations = this.database.repository(Organization)
		if (await organizations.findOne({ name: payload.name })) {
			throw new ConflictError(`Name already taken.`)
		}
		return organizations.create(payload)
	}

	async update(where: OrganizationUniqueProperties, payload: UpdateOrganizationPayload): Promise<Organization> {
		const organizations = this.database.repository(Organization)
		const organization = await organizations.findOneOrFail(where)
		const { name } = payload
		if (name && name !== organization.name && (await organizations.findOne({ name, id: Not(organization.id) }))) {
			throw new ConflictError(`Name already taken.`)
		}
		return organizations.update(organization, payload)
	}

	async delete(where: OrganizationUniqueProperties): Promise<Organization | null> {
		const organizations = this.database.repository(Organization)
		const organization = await organizations.findOneOrFail(where)
		return organizations.delete(organization)
	}

	async getMembersConnection(options: ListQueryParameter): Promise<GQLConnection<OrganizationMember>> {
		const organizationsMembers = this.database.repository(OrganizationMember)
		return organizationsMembers.getConnection(options)
	}

	async addMember(payload: OrganizationMemberProperties): Promise<OrganizationMember> {
		const users = this.database.repository(User)
		const organizations = this.database.repository(Organization)
		const organizationsMembers = this.database.repository(OrganizationMember)
		const { userId, role, organizationId } = payload
		const existingMember = await organizationsMembers.findOne({ userId, organizationId })
		if (existingMember) {
			throw new ConflictError(`User:${userId} is already member of Organization:${organizationId}.`)
		}
		if (role === 'owner') {
			throw new NotImplementedError(`Organization ownership transfer is not implemented.`)
		}
		await users.findOneOrFail({ id: userId })
		await organizations.findOneOrFail({ id: organizationId })
		return organizationsMembers.create(payload)
	}

	async removeMember(where: OrganizationMemberUniqueProperties): Promise<OrganizationMember | null> {
		const organizationsMembers = this.database.repository(OrganizationMember)
		const organizationMember = await organizationsMembers.findOne(where)
		if (!organizationMember) {
			return null
		}
		if (organizationMember.role === 'owner') {
			throw new ConflictError(`You must transfer ownership of the organization before leaving it.`)
		}
		return organizationsMembers.delete(organizationMember)
	}
}
