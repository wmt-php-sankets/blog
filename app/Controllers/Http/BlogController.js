'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')
const Blog = use('App/Models/Blog')
const { validate } = use('Validator')
const Database = use('Database')
const Config = use('Config')
/**
 * Resourceful controller for interacting with blogs
 */
class BlogController {

  /**
     * Show a list of all blogs.
   * GET blogs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async displayallblog({ request, response, view }) {
    try {
      const allBlog = await Blog.query().where('status', Config.get("local.defailtstatus.active")).select(['name', 'date', 'description']).fetch();
      return response.status(200).json({
        message: "display record",
        data: allBlog
      });
    } catch (error) {
      throw error;
    }
  }

  async displayuserblog({ request, response, view, auth }) {
    try {
      const user = await auth.getUser();
      const userBlog = await Blog.query().select(['id', 'name', 'date', 'description', 'status']).where('user_id', user.id).fetch();
      return response.status(200).json({
        message: "display record",
        data: userBlog
      });
    } catch (error) {
      throw error;
    }
  }

  async createuserblog({ request, response, view, auth }) {
    try {
      const trx = await Database.beginTransaction();
      const rules = {
        name: 'required|min:3',
        date: 'required',
        description: 'required'
      }

      const validation = await validate(request.all(), rules)

      if (validation.fails()) {
        return validation.messages()
      }

      const { name, date, description } = await request.post();

      const user = await auth.getUser();

      const userBlogupdate = await Blog.create({
        user_id: user.id,
        name: name,
        date: date,
        description: description
      });
      return response.status(200).json({
        message: "display record",
        data: userBlogupdate
      });
      trx.commit();
    } catch (error) {
      throw error;
    }
  }
  async updateuserblog({ request, response, auth, params }) {
    try {
      const trx = await Database.beginTransaction();
      const rules = {
        name: 'required|min:3',
        description: 'required'
      }
      const validation = await validate(request.all(), rules)
      if (validation.fails()) {
        return validation.messages()
      }
      const blogId = params.id;

      //  return response.send(blogId);

      const { name, date, description } = await request.post();
      const user = await auth.getUser();

      const userBlogcreate = await Blog.query().where('id', blogId).where('status', Config.get("local.defailtstatus.active")).where('user_id', user.id).update({
        user_id: user.id,
        name: name,
        date: date,
        description: description
      });

      return response.status(200).json({
        message: "record update successfull",
        data: userBlogcreate
      });
      trx.commit();
    } catch (error) {
      throw error;
    }
  }

  async deleteuserblog({ request, response, view, auth, params }) {
    try {
      const trx = await Database.beginTransaction();
      const user = await auth.getUser();

      const blogId = params.id;
      const deletebloag = await Blog.query().where('id', blogId).where('user_id', user.id).delete();

      return response.status(200).json({
        message: "record delete successfull",
      });
      trx.commit();
    } catch (error) {
      throw error;
    }
  }
  async blogpermission({ request, response, view, auth, params }) {
    try {
      const trx = await Database.beginTransaction();
      const user = await auth.getUser();
      const blogid = params.id;

      const permission = await Blog.query().where('user_id', user.id).where('id', blogid).update(
        {
          'status': Config.get("local.defailtstatus.active")
        });
      return response.json({
        message: "permission successfully"
      });
      trx.commit();
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async blogpermissiondisable({ request, response, view, auth, params }) {
    try {
      const trx = await Database.beginTransaction();
      const user = await auth.getUser();
      const blogid = params.id;
      const permission = await Blog.query().where('user_id', user.id).where('id', blogid).update(
        {
          'status': Config.get("local.defailtstatus.disactive")
        });
      return response.json({
        message: "permission disable successfully"
      });
      trx.commit();
    } catch (error) {
      throw error
    }
  }
}

module.exports = BlogController
