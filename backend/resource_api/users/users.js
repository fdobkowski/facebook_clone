const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const queries = require('./user_queries')

router.post('/', async (req, res) => {
    await pool.query(queries.post_user(req.body), (err, result) => {
        if (err) throw err
        console.log(result)
        res.status(200).send("OK")
    })
})

module.exports = router