import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'restaurant_promos'

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
      table.enu('day', ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']).notNullable()
      table.string('text', 255).notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
      table.unique(['restaurant_id', 'day'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
