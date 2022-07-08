const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const queries = require('./user_queries')
const CryptoJS = require('crypto-js')

router.get('/', async (req, res) => {
    const base64auth = (req.headers.authorization || "").split(" ")[1] || ""
    const [id, email, number, password] = Buffer.from(base64auth, "base64").toString().split(":")

    const encrypt = CryptoJS.AES.encrypt(password, "274989hash")

    await pool.query(queries.post_user({
        id: id,
        email: email,
        number: number,
        password: encrypt
    }), (err, result) => {
        if (err) throw err
        res.status(200).send("Successful")
    })
})

router.get('/all', async (req, res) => {
    await pool.query('SELECT * FROM users', (err, result) => {
        if (err) throw err
        res.status(200).send(result.rows)
    })
})

module.exports = router