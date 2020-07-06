'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')

const { validate } = use('Validator')

const Helpers = use('Helpers')

class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async signup({ request, auth, response }) {
    try {

      const rules = {
        email: 'required|email|unique:users,email',
        password: 'required|min:4'
      }

      const validation = await validate(request.all(), rules)
      if (validation.fails()) {
        return validation.messages()
      }
      const { fullname, password, email, profile } = request.post();
      const users = await User.create({
        fullname: fullname,
        email: email,
        password: password,
        profile: profile
      });
      // generate JWT token for user
      const token = await auth.generate(users)

      return response.json({
        status: 'success signup',
        data: token
      })

    } catch (error) {
      throw error
    }
  }


  async signin({ request, response, auth }) {
    try {

      const rules = {
        email: 'required|email',
        password: 'required|min:4'
      }

      const validation = await validate(request.all(), rules)
      if (validation.fails()) {
        return validation.messages()
      }

      const token = await auth.attempt(
        request.input('email'),
        request.input('password')
      )
      return response.json({
        status: 'success signin',
        data: token,
      })
    } catch (error) {
      throw error
    }
  }
  async profileupdate({ request, response, auth, params }) {
    try {

      const rules = {
        fullname: 'required|min:4'
      }

      const validation = await validate(request.all(), rules)
      if (validation.fails()) {
        return validation.messages()
      }

      const { profile, fullname } = request.post();

      const profilePic = request.file('profile', {
        types: ['image'],
        size: '5mb'
      })

      await profilePic.move(Helpers.tmpPath('uploads'), {
        name: profile,
        overwrite: true
      })

      const user = await auth.getUser();
      const userid = user.id;

      const profileupdate = await User.query().where('id', userid).first();

      if (!profileupdate == '') {
        profileupdate.profile = profilePic.clientName;
        profileupdate.fullname = fullname;

        await profileupdate.save();

        return response.status(201).json({
          message: "Successful created",
          data: profileupdate
        });
      }
    } catch (error) {
      throw error
    }
  }
}
module.exports = UserController
