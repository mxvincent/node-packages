import { resourceColumns } from '#/database/helpers/schemas'
import { organizationMember } from '#/database/schemas/organization-members'
import { relations } from 'drizzle-orm'
import { pgTable, text } from 'drizzle-orm/pg-core'

export const organization = pgTable('organization', {
	...resourceColumns,
	name: text('name').notNull().unique()
})

export type Organization = typeof organization.$inferSelect

/**
 * Define `Organization` relations
 */
export const organizationRelations = relations(organization, ({ many }) => ({
	members: many(organizationMember)
}))
