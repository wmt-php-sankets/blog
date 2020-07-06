'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VideoImageSchema extends Schema {
  up () {
    this.create('video_images', (table) => {
      table.increments()
      table.integer('blog_id').unsigned();
      table.foreign('blog_id').references('blogs.id').onDelete('CASCADE').onUpdate('CASCADE');
      table.string('url');
      table.enu('type', ['video', 'image'])
      table.timestamps()
    })
  }
  
  down () {
    this.drop('video_images')
  }
}

module.exports = VideoImageSchema
