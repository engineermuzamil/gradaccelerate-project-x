import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddStatusToProjects extends BaseSchema {
  protected tableName = 'projects'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('status', ['pending', 'in-progress', 'completed']).defaultTo('pending').notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
    })
  }
}