'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class VideoImage extends Model {
    blog() {
        return this.belongsTo('App/Models/Blog')
    }
}
module.exports = VideoImage
