'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const User = use('App/Models/User');
const Blog = use('App/Models/Blog')
const VideoImages = use('App/Models/VideoImage');
const { validate } = use('Validator');
const Database = use('Database');
const Helpers = use('Helpers');
const Config = use('Config')
const Multiplefile = use('App/Models/Multiplefile')
/**
 * Resourceful controller for interacting with videoimages
 */

class VideoImageController {
  async addVideoImage({ params, request, response, view, auth }) {
    try {
      const { url } = await request.post();
      const blogid = params.id;
      const user = await auth.getUser();

      if (user) {
        const profilePic = request.file('url', {
          types: ['image', 'video'],
          size: '10mb'
        })

        if (profilePic.type == 'image') {
          const imagepath = 'uploads/image/' + user.id + "/" + blogid;

          await profilePic.move(Helpers.tmpPath(imagepath), {
            name: url,
            overwrite: true
          })

          const imageAdd = await VideoImages.create({
            blog_id: blogid,
            url: imagepath + '/' + profilePic.clientName,
            type: "image"
          });
        }
        else if (profilePic.type == 'video') {
          const imagepath = 'uploads/video/' + user.id + "/" + blogid;
          await profilePic.move(Helpers.tmpPath(imagepath), {
            name: url,
            overwrite: true
          })
          const imageAdd = await VideoImages.create({
            blog_id: blogid,
            url: imagepath + '/' + profilePic.clientName,
            type: Config.get("local.iamgevideotype.2")
          });
        }
      }

    } catch (error) {
      throw error
    }
  }
  async allBlogDetails({ params, request, response, auth }) {
    try {
      const user = await auth.getUser();
      if (user) {
        const alldetails = await Blog.query().where('user_id', user.id).where('status', 1).with('videoimage').with('comments').fetch();
        return response.json({
          data: alldetails
        });
      }
    } catch (error) {
      throw error
    }
  }
  async multiplefile({ params, request, response, auth }) {
    try {
      const { url, name } = await request.post();
      const user = await auth.getUser();

      if (user) {
        const profilePics = request.file('url', {
          types: ['image'],
          size: '10mb'
        })


        var x = await profilePics.all();

        for (let i = 0; i < x.length; i++) {
          var y = await Multiplefile.create({
            url: x[i].clientName,
            name: name
          });
        }

        await profilePics.moveAll(Helpers.tmpPath('uploads/multiple'))
        return response.json({
          message: "multiplefile successfull added"
        });
      }

    } catch (error) {
      throw error
    }
  }

}

module.exports = VideoImageController
