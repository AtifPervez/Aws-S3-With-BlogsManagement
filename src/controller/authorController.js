const authorModel = require('../model/authorModel')
const jwt=require('jsonwebtoken')

const createAuthor = async (req, res) => {
    try {
        let data = req.body
        let { fname, lname, title, email, password } = data

        if (!Object.keys(data).length) return res.status(400).send({ status: false, msg: "enter some data" })

        if (!fname) return res.status(400).send({ status: false, msg: "enter fname" })

        if (!lname) return res.status(400).send({ status: false, msg: 'enter lname' })

        if (!title) return res.status(400).send({ status: false, msg: 'enter title' })
        if (['Mr', 'Mrs', 'Miss'].indexOf(data.title)) res.status(400).send({ status: false, msg: "enter Mr || Mrs || Miss only" })

        if (!email) return res.status(400).send({ status: false, msg: 'enter emailId' })

        let emailCheck = await authorModel.findOne({ email: email })
        // console.log({email:email});
        if (emailCheck) return res.status(400).send({ status: false, msg: "emailId is already in used" })

        if (!password) return res.status(400).send({ status: false, msg: 'enter password' })

        let savedData = await authorModel.create(data)

        res.status(201).send({ status: true, msg: savedData })


    } catch (error) {
        res.status(500).send({ status: false, msg: error.msg })

    }

}

const logIn = async (req, res) => {
    try {
      let data=req.body
      if(!Object.keys(data).length) return res.status(400).send({status:false,msg:'please enter your emailId and password'})

      let {email,password}=data
      if(!email) return res.status(400).send({status:false,msg:'enter your email id'})
      let checkEmail=await authorModel.findOne({email})

      
       if(!checkEmail) return res.status(400).send({status:false,msg:'no such account found with this emailId'})

       if(!password) return res.status(400).send({status:false,msg:'enter password'})

       let checkPassword=await authorModel.findOne({password})

       if(!checkPassword) return res.status(404).send({status:false,msg:'wrong password'})

       let user=await authorModel.findOne({email:email,password:password})

       let token=jwt.sign({user:user._id.toString()},'abc');
  
       res.setHeader('x-api-key',token);     
       
       return res.status(201).send({status:true,msg:'Token created successfully',Token:token})


       
    } catch (error) {
        res.status(500).send({ status: false, msg: error.msg })

    }

}
//auth and authorization both perform
const getAuthorByParams=async(req,res)=>{
    try {

        let _id = req.params._id
        let token=req.headers['x-api-key']
        let decodedToken=jwt.verify(token,'abc')
        let authorLoggedIn=decodedToken.user
        
        if(authorLoggedIn!=_id) return res.status(403).send({status:false,msg:'authorisation failed'})

        let check_id = await authorModel.findOne({ _id: _id })
        if (!check_id) return res.status(404).send({ status: false, msg: 'no such Author exists' })

        let getAuthorData = await authorModel.findById({ _id: _id })

        return res.status(200).send({ status: true, msg: 'Get author details', data: getAuthorData })



        
    } catch (error) {
        res.status(500).send({ status: false, msg: error.msg })
    }
}
       

module.exports = { createAuthor, logIn,getAuthorByParams }


   













