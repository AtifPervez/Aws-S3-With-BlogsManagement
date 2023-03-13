const express=require('express')
const router=express.Router()
const authorController=require('../controller/authorController')
const blogController=require('../controller/blogController')

router.post('/createAuthor',authorController.createAuthor)
router.post('/createBlog',blogController.createBlog)
router.get('/getBlog',blogController.getBlog)
router.put('/updateBlog/:id',blogController.updateBlog)
router.delete('/deleteBlog/:id',blogController.deleteBlog)

module.exports=router