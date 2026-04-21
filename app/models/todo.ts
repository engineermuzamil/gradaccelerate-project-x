import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Label from '#models/label'
import User from '#models/user'

export default class Todo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare priority: 'low' | 'medium' | 'high'

  @column()
  declare status: 'pending' | 'in-progress' | 'completed'

  @column({ columnName: 'is_completed' })
  declare isCompleted: boolean

  @column({ columnName: 'user_id' })
  declare userId: number | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Label, {
    pivotTable: 'todo_labels',
  })
  declare labels: ManyToMany<typeof Label>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
