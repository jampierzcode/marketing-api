import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'campaign_requests'

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
      table.enu('objective', ['reservations', 'whatsapp', 'reach']).notNullable()
      table.enu('day_to_push', ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']).notNullable()
      table.decimal('budget_daily', 10, 2).notNullable()
      table.string('zone', 255).nullable()
      table.enu('duration', ['6s', '10s', '15s']).notNullable()
      table
        .enu('video_method', ['manual_capcut', 'canva_template', 'tiktok_symphony'])
        .notNullable()
      table
        .enu('status', ['draft', 'ideas_generated', 'brief_generated', 'launched'])
        .notNullable()
        .defaultTo('draft')
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
      table.index(['restaurant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
