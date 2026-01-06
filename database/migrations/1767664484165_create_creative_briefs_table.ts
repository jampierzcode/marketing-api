import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'creative_briefs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('campaign_request_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('campaign_requests')
        .onDelete('CASCADE')
      table.string('hook', 255).notNullable()
      table.string('cta', 255).notNullable()
      table.jsonb('on_screen_text').notNullable()
      table.jsonb('storyboard').notNullable()
      table.jsonb('capcut_recipe').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
      table.index(['campaign_request_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
