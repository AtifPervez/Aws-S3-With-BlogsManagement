const express=require('express')
const router=express.Router()
const authorController=require('../controller/authorController')
const blogController=require('../controller/blogController')
const middleWare=require('../middleware/auth')

router.post('/createAuthor',authorController.createAuthor)

router.post('/createBlog',blogController.createBlog)

router.get('/getBlog',blogController.getBlog)

router.put('/updateBlog/:id',blogController.updateBlog)

router.delete('/deleteBlog/:id',blogController.deleteBlog)

router.delete('/deleteBlogByQueryParams',blogController.deleteBlogByQueryParams)

router.post('/logIn',authorController.logIn)

router.post('/createAuthor_auth',middleWare.auth,authorController.createAuthor)

router.get('/getAuthorByParams/:_id',middleWare.auth,authorController.getAuthorByParams)




module.exports=router