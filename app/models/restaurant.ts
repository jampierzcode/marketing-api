import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import RestaurantPromo from '#models/restaurant_promo'
import Asset from '#models/asset'
import CampaignRequest from '#models/campaign_request'

export default class Restaurant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare city: string | null

  @column()
  declare zone: string | null

  @column()
  declare tone: string | null

  @column()
  declare offers: string | null

  @column()
  declare hours: string | null

  @column()
  declare metaToken: string | null

  @column()
  declare tiktokToken: string | null

  @hasMany(() => RestaurantPromo)
  declare promos: HasMany<typeof RestaurantPromo>

  @hasMany(() => Asset)
  declare assets: HasMany<typeof Asset>

  @hasMany(() => CampaignRequest)
  declare campaignRequests: HasMany<typeof CampaignRequest>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
