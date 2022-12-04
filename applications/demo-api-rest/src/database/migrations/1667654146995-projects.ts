import { resource } from '@mxvincent/typeorm'
import { MigrationInterface, QueryRunner, Table } from 'typeorm'

const projectTable = new Table({
	name: 'Project',
	columns: resource([
		{ name: 'name', type: 'text' },
		{ name: 'organizationId', type: 'uuid' }
	]),
	foreignKeys: [
		{
			columnNames: ['organizationId'],
			referencedColumnNames: ['id'],
			referencedTableName: 'Organization',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		}
	],
	indices: [
		{
			columnNames: ['name', 'organizationId'],
			isUnique: true
		}
	]
})

const issueTable = new Table({
	name: 'Issue',
	columns: resource([
		{ name: 'name', type: 'text' },
		{ name: 'description', type: 'text' },
		{ name: 'projectId', type: 'uuid' },
		{ name: 'userId', type: 'uuid' }
	]),
	foreignKeys: [
		{
			columnNames: ['projectId'],
			referencedColumnNames: ['id'],
			referencedTableName: 'Project',
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
	]
})

export class ProjectsMigration implements MigrationInterface {
	name = 'projects-1667654146995'

	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(projectTable)
		await queryRunner.createTable(issueTable)
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(issueTable)
		await queryRunner.dropTable(projectTable)
	}
}
