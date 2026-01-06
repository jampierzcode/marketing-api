import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CampaignRun extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare restaurantId: number

  @column()
  declare creativeBriefId: number

  @column()
  declare platform: 'meta' | 'tiktok'

  @column()
  declare externalCampaignId: string | null

  @column()
  declare externalAdsetId: string | null

  @column()
  declare externalAdId: string | null

  @column()
  declare spend: number | null
  @column({
    prepare: (value: any) => JSON.stringify(value ?? {}),
    consume: (value: any) => {
      if (value == null) return {}
      if (typeof value === 'object') return value
      try {
        return typeof value === 'string' ? JSON.parse(value) : value
      } catch {
        return {}
      }
    },
  })
  declare results: any

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
