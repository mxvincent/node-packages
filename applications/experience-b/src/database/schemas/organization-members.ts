import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core'
import { organization } from './organizations'
import { user } from './users'

export const organizationMember = pgTable(
	'organization_member',
	{
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organization.id),
		userId: uuid('user_id')
			.notNull()
			.references(() => user.id),

		role: text('role').notNull()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.organizationId, table.userId] })
	})
)

export type OrganizationMember = typeof organizationMember.$inferSelect

/**
 * Define `OrganizationMember` relations
 */
export const organizationMemberRelations = relations(organizationMember, ({ one }) => ({
	organization: one(organization, {
		fields: [organizationMember.organizationId],
		references: [organization.id]
	}),
	user: one(user, {
		fields: [organizationMember.userId],
		references: [user.id]
	})
}))
