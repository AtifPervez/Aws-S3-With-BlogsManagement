const authorModel = require('../model/authorModel')

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




module.exports = { createAuthor }









