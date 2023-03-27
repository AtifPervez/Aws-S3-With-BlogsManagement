const authorModel = require('../model/authorModel')
const jwt = require('jsonwebtoken')
const aws = require('aws-sdk')

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
        let data = req.body
        if (!Object.keys(data).length) return res.status(400).send({ status: false, msg: 'please enter your emailId and password' })

        let { email, password } = data
        if (!email) return res.status(400).send({ status: false, msg: 'enter your email id' })
        let checkEmail = await authorModel.findOne({ email })


        if (!checkEmail) return res.status(400).send({ status: false, msg: 'no such account found with this emailId' })

        if (!password) return res.status(400).send({ status: false, msg: 'enter password' })

        let checkPassword = await authorModel.findOne({ password })

        if (!checkPassword) return res.status(404).send({ status: false, msg: 'wrong password' })

        let user = await authorModel.findOne({ email: email, password: password })

        let token = jwt.sign({ user: user._id.toString() }, 'abc');

        res.setHeader('x-api-key', token);

        return res.status(201).send({ status: true, msg: 'Token created successfully', Token: token })



    } catch (error) {
        res.status(500).send({ status: false, msg: error.msg })

    }

}
//auth and authorization both perform
const getAuthorByParams = async (req, res) => {
    try {

        let _id = req.params._id
        let token = req.headers['x-api-key']
        let decodedToken = jwt.verify(token, 'abc')
        let authorLoggedIn = decodedToken.user

        if (authorLoggedIn != _id) return res.status(403).send({ status: false, msg: 'authorisation failed' })

        let check_id = await authorModel.findOne({ _id: _id })
        if (!check_id) return res.status(404).send({ status: false, msg: 'no such Author exists' })

        let getAuthorData = await authorModel.findById({ _id: _id })

        return res.status(200).send({ status: true, msg: 'Get author details', data: getAuthorData })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.msg })
    }
}




//AWS S3

aws.config.update({
    accessKeyId: "AKIAZ6Q6Y4B3SJPHAHME",
    secretAccessKey: "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",
    region: "ap-south-1"
})

const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
        let s3 = new aws.S3({ apiVersion: '2006-03-01' })

        let uploadParams = {
            ACL:'public-read',
            Bucket: "this-atif-bucket",
            Key: "authorImage/" + file.originalname,
            Body: file.buffer
        }

        s3.upload(uploadParams, (err, data) => {
            if (err) {
                return reject({ "error": err })
            }
            console.log(data);
            console.log('authorImage file uploaded successfully');
            return resolve(data.Location)
        })
    })
}


const awsAuthorImage = async (req, res) => {

    try{
        let files= req.files
        if(files && files.length>0){
           
            let uploadedFileURL= await uploadFile( files[0] )
            res.status(201).send({status:true,msg: "file uploaded succesfully",url: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
}




module.exports = { createAuthor, logIn, getAuthorByParams, awsAuthorImage }



































