import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import CampaignRequest from '#models/campaign_request'

export default class CreativeBrief extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare campaignRequestId: number

  @column()
  declare hook: string

  @column()
  declare cta: string

  @column({
    prepare: (value: any) => JSON.stringify(value ?? []),
    consume: (value: any) => {
      if (value == null) return []
      if (Array.isArray(value)) return value
      try {
        return typeof value === 'string' ? JSON.parse(value) : value
      } catch {
        return []
      }
    },
  })
  declare onScreenText: string[]

  @column({
    prepare: (value: any) => JSON.stringify(value ?? []),
    consume: (value: any) => {
      if (value == null) return []
      if (Array.isArray(value)) return value
      try {
        return typeof value === 'string' ? JSON.parse(value) : value
      } catch {
        return []
      }
    },
  })
  declare storyboard: any[]

  @column({
    prepare: (value: any) => JSON.stringify(value ?? []),
    consume: (value: any) => {
      if (value == null) return []
      if (Array.isArray(value)) return value
      try {
        return typeof value === 'string' ? JSON.parse(value) : value
      } catch {
        return []
      }
    },
  })
  declare capcutRecipe: any[]

  @belongsTo(() => CampaignRequest)
  declare campaignRequest: BelongsTo<typeof CampaignRequest>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
