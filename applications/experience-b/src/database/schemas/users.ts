import { resourceColumns } from '#/database/helpers/schemas'
import { organizationMember } from '#/database/schemas/organization-members'
import { relations } from 'drizzle-orm'
import { pgTable, text } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
	...resourceColumns,
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique()
})

export type User = typeof user.$inferSelect

/**
 * Define `User` relations
 */
export const userRelations = relations(user, ({ many }) => ({
	organizations: many(organizationMember)
}))
