'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MultiplefileSchema extends Schema {
  up () {
    this.create('multiplefiles', (table) => {
      table.increments()
      table.string('name');
      table.string('url');
      table.timestamps()
    })
  }

  down () {
    this.drop('multiplefiles')
  }
}

module.exports = MultiplefileSchema
