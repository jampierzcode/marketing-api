import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'campaign_ideas'

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
      table.string('title', 255).notNullable()
      table.text('description').notNullable()
      table.text('rationale').nullable()
      table.boolean('is_selected').notNullable().defaultTo(false)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
      table.index(['campaign_request_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
