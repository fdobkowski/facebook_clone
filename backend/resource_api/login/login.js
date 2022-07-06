const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const queries = require('./login_queries')
const CryptoJS = require('crypto-js')

router.get("/", async (req, res) => {

    const base64auth = (req.headers.authorization || "").split(" ")[1] || ""
    const [login, password] = Buffer.from(base64auth, "base64").toString().split(":")

    pool.query(queries.auth_user({login: login, password: password}), async (error, response) => {
        if (error) throw error
        const decrypt = CryptoJS.AES.decrypt(response.rows[0].password, '274989hash')
        if (password === decrypt.toString(CryptoJS.enc.Utf8)) {
            await pool.query(queries.get_profile_id({login: login}), (error, response) => {
                if (error) throw error
                res.status(200).send(response.rows[0].id)
            })
        }
        else res.status(401).send("Wrong credentials")
    })
})

module.exports = router