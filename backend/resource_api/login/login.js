const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const queries = require('./login_queries')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

router.get("/", async (req, res) => {

    const base64auth = (req.headers.authorization || "").split(" ")[1] || ""
    const [login, password] = Buffer.from(base64auth, "base64").toString().split(":")

    pool.query(queries.auth_user({login: login, password: password}), async (error, response) => {
        if (error) throw error
        if (response.rows.length !== 0) {
            const decrypt = CryptoJS.AES.decrypt(response.rows[0].password, process.env.HASH_KEY)
            if (password === decrypt.toString(CryptoJS.enc.Utf8)) {
                await pool.query(queries.get_profile_id({login: login}), async (error, response) => {
                    if (error) throw error
                    await pool.query(queries.get_profile_name(response.rows[0].id), (error, result) => {
                        if (error) throw error

                        const token = jwt.sign({
                            first_name: result.rows[0].first_name,
                            last_name: result.rows[0].last_name
                        }, process.env.HASH_KEY)

                        res.status(200).json({
                            id: response.rows[0].id,
                            first_name: result.rows[0].first_name,
                            last_name: result.rows[0].last_name,
                            token: token
                        })
                    })
                })
            } else res.status(401).send("Wrong credentials")
        } else res.status(401).send("Wrong credentials")
    })
})

module.exports = router