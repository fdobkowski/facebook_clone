const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const queries = require('./messages_queries')

router.post('/', async (req, res) => {
    await pool.query(queries.send_message(req.body), (err, result) => {
        if (err) throw err
        res.status(200).send("OK")
    })
})

router.get('/:id', async (req, res) => {
    await pool.query(queries.get_messages(req.params.id), (err, result) => {
        if (err) throw err
        res.status(200).send(result.rows)
    })
})

module.exports = router