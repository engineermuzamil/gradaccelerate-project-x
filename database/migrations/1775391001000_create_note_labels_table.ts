import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'note_labels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('note_id').unsigned().notNullable().references('id').inTable('notes').onDelete('CASCADE')
      table.integer('label_id').unsigned().notNullable().references('id').inTable('labels').onDelete('CASCADE')
      table.unique(['note_id', 'label_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}