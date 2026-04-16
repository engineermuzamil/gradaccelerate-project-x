import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notes'

  async up() {
    const hasColumn = await this.db.schema.hasColumn(this.tableName, 'shared_token')

    if (hasColumn) {
      return
    }

    this.schema.alterTable(this.tableName, (table) => {
      table.string('shared_token').nullable().unique()
    })
  }

  async down() {
    const hasColumn = await this.db.schema.hasColumn(this.tableName, 'shared_token')

    if (!hasColumn) {
      return
    }

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('shared_token')
    })
  }
}
