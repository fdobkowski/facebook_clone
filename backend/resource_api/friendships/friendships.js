const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const queries = require('./friendship_queries')

router.post('/', async (req, res) => {
    await pool.query(queries.post_friendship(req.body), (err, result) => {
        if (err) throw err
        res.status(200).send("OK")
    })
})

module.exports = router