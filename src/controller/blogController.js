
const authorModel = require("../model/authorModel");
const blogModel = require('../model/blogModel')
const moment=require('moment')

const createBlog = async (req, res) => {

    try {

        let data = req.body
        if (!Object.keys(data).length) res.status(400).send({ status: false, msg: 'enter some data' })

        let { title, body, authorId, tags, category, subcategory } = data

        if (!title) return res.status(400).send({ status: false, msg: 'enter title' })

        if (!authorId) return res.status(400).send({ status: false, msg: 'enter authorId' })

        let authorCheck = await authorModel.findOne({ _id: authorId })

        if (!authorCheck) return res.status(400).send({ status: false, msg: 'no such author with this id' })

        if (!body) return res.status(400).send({ status: false, msg: 'enter body' })

        if (!tags) return res.status(400).send({ status: false, msg: 'enter tags' })

        if (!category) return res.status(400).send({ status: false, msg: 'enter category' })

        if (!subcategory) return res.status(400).send({ status: false, msg: 'enter subcategory' })

        let savedData = await blogModel.create(data)

        return res.status(201).send({ status: true, blogData: savedData })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.msg })
    }

}


const getBlog = async (req, res) => {
    try {
        let data = req.query

        if (!Object.keys(data).length) res.status(400).send({ status: false, msg: 'enter some data in query params' })

        let { authorId, category, tags, subcategory } = data
        if (!authorId) res.status(400).send({ status: false, msg: 'enter authorId' })
        if (!category) res.status(400).send({ status: false, msg: 'enter category' })
        if (!tags) res.status(400).send({ status: false, msg: 'enter tags' })
        if (!subcategory) res.status(400).send({ status: false, msg: 'enter subcategory' })


        let savedData = await blogModel.find({ authorId: data.authorId, category: data.category, tags: data.tags, subcategory: subcategory }).populate('authorId')

        res.status(200).send({ status: true, msg: savedData })



    } catch (error) {
        return res.status(500).send({ status: false, msg: error.msg })
    }
}

const updateBlog = async (req, res) => {
try{
    
    let id = req.params.id
    let checkBlogId = await blogModel.findOne({id})
    if (!checkBlogId) return res.status(404).send({ status: false, msg: 'no such blogId exists' })
    let data = req.query
   let date=moment().format("DD/MM/YYYY")
    let updateData = await blogModel.findByIdAndUpdate(id,
        {
            title: data.title,
            body: data.body,
            tags: data.tags,
            subcategory: data.subcategory,
            isPublished:true,
            publishedAt:date
        },{new:true})

    res.status(200).send({status:true, updatedBlog: updateData })



} catch (error) {
    return res.status(500).send({ status: false, msg: error.msg })
}



}

const deleteBlog=async(req,res)=>{
     let id=req.params.id

     let checkBlog=await blogModel.findById(id)
     if(!checkBlog) res.status(404).send({status:false,msg:'no such blog exist in the DB'})

     let deleteData=await blogModel.findByIdAndDelete(id)

     res.send({msg:deleteData})





}






module.exports = { createBlog, getBlog, updateBlog,deleteBlog }











