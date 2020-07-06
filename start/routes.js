'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */

const Route = use('Route')
const Blog = use('App/Models/Blog')
const User = use('App/Models/User')
Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('/signup', 'UserController.signup');
Route.post('/signin', 'UserController.signin');

//profile update
Route.post('/profileupdate', 'UserController.profileupdate').middleware('auth');

//blogs
Route.get('/blog/displayallblog', 'BlogController.displayallblog').middleware('auth');
Route.get('/blog/displayuserblog', 'BlogController.displayuserblog').middleware('auth');

Route.post('/blog/createuserblog', 'BlogController.createuserblog').middleware('auth');
Route.post('/blog/updateuserblog/:id', 'BlogController.updateuserblog').middleware('auth');
Route.post('/blog/deleteuserblog/:id', 'BlogController.deleteuserblog').middleware('auth');

//permisson in blog in admin user
Route.post('/blog/blogpermission/:id', 'BlogController.blogpermission').middleware('auth');
Route.post('/blog/blogpermissiondisable/:id', 'BlogController.blogpermissiondisable').middleware('auth');

//add photo video blogs
Route.post('/blog/addVideoImage/:id', 'VideoImageController.addVideoImage').middleware('auth');
Route.get('/blog/allBlogDetails', 'VideoImageController.allBlogDetails').middleware('auth');

  //comment
  Route.get('/comment/index/:id', 'CommentController.displayBlogComment').middleware('auth');
  Route.post('/comment/addcomment/:id', 'CommentController.addcomment').middleware('auth');
  Route.get('/comment/usercomment/:id', 'CommentController.usercomment').middleware('auth');

