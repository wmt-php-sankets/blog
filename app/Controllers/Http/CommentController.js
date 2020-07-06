'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User');
const Blog = use('App/Models/Blog');
const Comment = use('App/Models/Comment')
const { validate } = use('Validator')
const Database = use('Database')
/**
 * Resourceful controller for interacting with comments
 */
class CommentController {
  async addcomment({ request, response, auth, params }) {
    try {
      const trx = await Database.beginTransaction()
      const rules = {
        comment: 'required|min:1',
      }

      const validation = await validate(request.all(), rules)
      if (validation.fails()) {
        return validation.messages()
      }

      const blogId = params.id;

      const { comment } = request.post();
      const user = await auth.getUser();

      if (user) {
        const addcomment = await Comment.create({
          "blog_id": blogId,
          "user_id": user.id,
          "comment": comment
        });
        return response.status(200).json({
          message: "successfull created",
          data: addcomment
        });
      }
      trx.commit();
    } catch (error) {
      throw error
    }
  }


  async usercomment({ params, auth, request, response }) {
    const blogId = params.id;
    const user = await auth.getUser();
    if (user) {
      const comment = await Comment.query().where('blog_id', blogId).where('user_id', user.id).fetch();
      return response.status(200).json({
        message: "display blog comments",
        data: comment
      });
    }
  }
  async displayBlogComment({ params, auth, request, response }) {

    try {
      const blogId = params.id;
      const user = await auth.getUser();

      if (user) {
        const comment = await Comment.query().where('blog_id', blogId).fetch();
        return response.status(200).json({
          message: "display blog comments",
          data: comment
        });
      }
    } catch (error) {
      throw error
    }
  }
}
module.exports = CommentController
