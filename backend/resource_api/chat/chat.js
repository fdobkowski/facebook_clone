const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const queries = require('./chat_queries')

router.post('/', async (req, res) => {
    await pool.query(queries.create_chat(req.body), (err, result) => {
        if (err) throw err
        res.status(200).send("OK")
    })
})

router.get('/:sender/:receiver', async (req, res) => {
    await pool.query(queries.get_chat(req.params.sender, req.params.receiver), (err, result) => {
        if (err) throw err
        res.status(200).send(result.rows)
    })
})

module.exports = router