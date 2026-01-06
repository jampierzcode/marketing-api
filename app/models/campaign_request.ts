import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Restaurant from '#models/restaurant'
import CampaignIdea from '#models/campaign_idea'
import CreativeBrief from '#models/creative_brief'

export default class CampaignRequest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare restaurantId: number

  @column()
  declare objective: 'reservations' | 'whatsapp' | 'reach'

  @column()
  declare dayToPush: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

  @column()
  declare budgetDaily: number

  @column()
  declare zone: string | null

  @column()
  declare duration: '6s' | '10s' | '15s'

  @column()
  declare videoMethod: 'manual_capcut' | 'canva_template' | 'tiktok_symphony'

  @column()
  declare status: 'draft' | 'ideas_generated' | 'brief_generated' | 'launched'

  @belongsTo(() => Restaurant)
  declare restaurant: BelongsTo<typeof Restaurant>

  @hasMany(() => CampaignIdea)
  declare ideas: HasMany<typeof CampaignIdea>

  @hasMany(() => CreativeBrief)
  declare briefs: HasMany<typeof CreativeBrief>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
