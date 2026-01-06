import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'restaurants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('city', 120).nullable()
      table.string('zone', 120).nullable()
      table.string('tone', 255).nullable()
      table.text('offers').nullable()
      table.string('hours', 255).nullable()
      table.text('meta_token').nullable()
      table.text('tiktok_token').nullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
