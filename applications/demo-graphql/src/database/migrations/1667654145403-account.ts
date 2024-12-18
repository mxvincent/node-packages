import { MigrationInterface, QueryRunner, Table, TableIndex, withDeletableResourceColumns } from '@mxvincent/typeorm'

export class AccountMigration implements MigrationInterface {
	name = 'account-1667654145403'

	createdAtIndex = new TableIndex({ columnNames: ['createdAt'] })

	userTable = new Table({
		name: 'User',
		columns: withDeletableResourceColumns([
			{ name: 'username', type: 'text', isUnique: true },
			{ name: 'email', type: 'text', isUnique: true },
			{ name: 'firstName', type: 'text' },
			{ name: 'lastName', type: 'text' }
		]),
		indices: [this.createdAtIndex]
	})
	organizationTable = new Table({
		name: 'Organization',
		columns: withDeletableResourceColumns([{ name: 'name', type: 'text', isUnique: true }]),
		indices: [this.createdAtIndex]
	})
	organizationMemberTable = new Table({
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

	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(this.userTable)
		await queryRunner.createTable(this.organizationTable)
		await queryRunner.createTable(this.organizationMemberTable)
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(this.organizationMemberTable)
		await queryRunner.dropTable(this.organizationTable)
		await queryRunner.dropTable(this.userTable)
	}
}
