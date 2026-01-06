import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'campaign_runs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('restaurant_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('restaurants')
        .onDelete('CASCADE')
      table
        .integer('creative_brief_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('creative_briefs')
        .onDelete('CASCADE')
      table.enu('platform', ['meta', 'tiktok']).notNullable()
      table.string('external_campaign_id', 255).nullable()
      table.string('external_adset_id', 255).nullable()
      table.string('external_ad_id', 255).nullable()
      table.decimal('spend', 10, 2).nullable()
      table.jsonb('results').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
      table.index(['restaurant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
