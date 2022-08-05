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
    }), (err) => {
        if (err) {
            if (err.code === '23505') {
                if (err.constraint === 'users_email_key') res.status(409).send('User with this email already exist')
                else if (err.constraint === 'users_number_key')  res.status(409).send('User with this phone number already exist')
                return
            } else {
                console.error(err)
                res.status(500).send('Something went wrong')
                return
            }
        }
        res.status(200).send("Successful")
    })
})

module.exports = router