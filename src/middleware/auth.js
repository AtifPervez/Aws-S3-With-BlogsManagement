const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(404).send({ status: false, msg: 'token is missing' })

        let decodedToken = jwt.verify(token, 'abc')

        if (!decodedToken) return res.status(401).send({ status: false, msg: 'invalid token' })

        next()


    } catch (error) {
        return res.status(500).send({ status: false, msg: error.msg })
    }

}
module.exports = { auth }













