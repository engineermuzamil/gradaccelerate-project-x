import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddPinnedToNotes extends BaseSchema {
  protected tableName = 'notes'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('pinned').defaultTo(false).notNullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('pinned')
    })
  }
}