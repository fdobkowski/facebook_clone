const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    const token = (req.headers.authorization || '').split(' ')[1] || ''

    jwt.verify(token, process.env.HASH_KEY, (err) => {
        if (err) res.sendStatus(403)
        return
    })

    next()
}