import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Restaurant from '#models/restaurant'

export default class Asset extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare restaurantId: number

  @column()
  declare type: 'photo' | 'video'

  @column()
  declare url: string

  // PG jsonb: tags es array real
  @column({
    prepare: (value: string[]) => JSON.stringify(value ?? []),
    consume: (value: any) => {
      if (value == null) return []
      // pg puede devolver objeto/array ya parseado
      if (Array.isArray(value)) return value
      try {
        return typeof value === 'string' ? JSON.parse(value) : value
      } catch {
        return []
      }
    },
  })
  declare tags: string[]

  @belongsTo(() => Restaurant)
  declare restaurant: BelongsTo<typeof Restaurant>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
