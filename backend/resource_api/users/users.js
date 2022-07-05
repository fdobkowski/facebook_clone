const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const queries = require('./user_queries')

router.get('/', async (req, res) => {
    const base64auth = (req.headers.authorization || "").split(" ")[1] || ""
    const [id, email, number, password] = Buffer.from(base64auth, "base64").toString().split(":")

    await pool.query(queries.post_user({
        id: id,
        email: email,
        number: number,
        password: password
    }), (err, result) => {
        if (err) throw err
        console.log(result)
        res.status(200).send("Successful")
    })
})

module.exports = router