import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Label from '#models/label'
import User from '#models/user'

export default class Note extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare pinned: boolean

  @column({ columnName: 'image_url' })
  declare imageUrl: string | null

  @column({ columnName: 'shared_token' })
  declare sharedToken: string | null

  @column({ columnName: 'user_id' })
  declare userId: number | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Label, {
    pivotTable: 'note_labels',
  })
  declare labels: ManyToMany<typeof Label>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
