import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'auth_access_tokens'

  async up() {
    const hasTable = await this.db.schema.hasTable(this.tableName)

    if (hasTable) {
      return
    }

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('tokenable_id').unsigned().notNullable()
      table.string('type').notNullable()
      table.string('name').nullable()
      table.string('hash', 255).notNullable()
      table.text('abilities').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('last_used_at').nullable()
      table.timestamp('expires_at').nullable()

      table.index(['tokenable_id', 'type'])
      table.unique(['hash'])
    })
  }

  async down() {
    const hasTable = await this.db.schema.hasTable(this.tableName)

    if (!hasTable) {
      return
    }

    this.schema.dropTable(this.tableName)
  }
}
