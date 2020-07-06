'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BlogSchema extends Schema {
  up () {
    this.create('blogs', (table) => {
      table.increments()
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE');
      table.string('name', 80);
      table.date('date').nullable();
      table.string('description');
      table.boolean('status')
      table.timestamps();
    })
  }
  down () {
    this.drop('blogs')
  }
}

module.exports = BlogSchema
