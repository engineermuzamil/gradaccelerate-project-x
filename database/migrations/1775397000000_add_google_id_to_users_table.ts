import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    const hasColumn = await this.db.schema.hasColumn(this.tableName, 'google_id')

    if (hasColumn) {
      return
    }

    this.schema.alterTable(this.tableName, (table) => {
      table.string('google_id').nullable().unique()
    })
  }

  async down() {
    const hasColumn = await this.db.schema.hasColumn(this.tableName, 'google_id')

    if (!hasColumn) {
      return
    }

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('google_id')
    })
  }
}
