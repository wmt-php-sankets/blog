'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments();
      table.integer('blog_id').unsigned();
      table.foreign('blog_id').references('blogs.id').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE');
      table.string('comment');
      table.timestamps();
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
