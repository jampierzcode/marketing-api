import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'assets'

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
      table.enu('type', ['photo', 'video']).notNullable()
      table.text('url').notNullable()
      table.jsonb('tags').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
      table.index(['restaurant_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
