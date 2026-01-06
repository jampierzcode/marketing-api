import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import CampaignRequest from '#models/campaign_request'

export default class CampaignIdea extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare campaignRequestId: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare rationale: string | null

  @column()
  declare isSelected: boolean

  @belongsTo(() => CampaignRequest)
  declare campaignRequest: BelongsTo<typeof CampaignRequest>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
