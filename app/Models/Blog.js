'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Blog extends Model {
  comments() {
    return this.hasMany('App/Models/Comment','id','blog_id')
  }
  videoimage () {
    return this.hasMany('App/Models/VideoImage')
  }

}

module.exports = Blog
