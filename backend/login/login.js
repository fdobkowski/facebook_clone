const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const queries = require('./login_queries')

router.post("/", (req, res) => {
    pool.query(queries.auth_user(req.body), (error, response) => {
        if (error) throw error
        if (response.rows[0].exists) res.status(200).send("Authorized")
        else res.status(403).send("Unauthorized")
    })
})

module.exports = router