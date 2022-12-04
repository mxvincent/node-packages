import { resource } from '@mxvincent/typeorm'
import { MigrationInterface, QueryRunner, Table } from 'typeorm'

const userTable = new Table({
	name: 'User',
	columns: resource([
		{ name: 'username', type: 'text', isUnique: true },
		{ name: 'email', type: 'text', isUnique: true },
		{ name: 'firstName', type: 'text' },
		{ name: 'lastName', type: 'text' }
	])
})

const organizationTable = new Table({
	name: 'Organization',
	columns: resource([{ name: 'name', type: 'text' }])
})

const organizationMemberTable = new Table({
	name: 'OrganizationMember',
	columns: [
		{ name: 'organizationId', type: 'uuid', isPrimary: true },
		{ name: 'userId', type: 'uuid', isPrimary: true },
		{
			name: 'role',
			type: 'text',
			enum: ['admin', 'developer', 'owner']
		}
	],
	foreignKeys: [
		{
			columnNames: ['organizationId'],
			referencedColumnNames: ['id'],
			referencedTableName: 'Organization',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		},
		{
			columnNames: ['userId'],
			referencedColumnNames: ['id'],
			referencedTableName: 'User',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		}
	],
	indices: [
		{
			columnNames: ['organizationId']
		},
		{
			columnNames: ['userId']
		}
	]
})

export class OrganizationsMigration implements MigrationInterface {
	name = 'organizations-1667654145403'

	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(userTable)
		await queryRunner.createTable(organizationTable)
		await queryRunner.createTable(organizationMemberTable)
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(organizationMemberTable)
		await queryRunner.dropTable(organizationTable)
		await queryRunner.dropTable(userTable)
	}
}
