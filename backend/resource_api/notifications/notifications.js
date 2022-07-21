const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const queries = require('./notification_queries')

router.post('/', async (req, res) => {
    await pool.query(queries.post_notification(req.body), (err, result) => {
        if (err) throw err
        res.status(200).send("OK")
    })
})

router.get("/:id", async (req, res) => {
    await pool.query(queries.get_notifications(req.params.id), (err, result) => {
        if (err) throw err
        res.send(result.rows)
    })
})

router.get('/single/:id', async (req, res) => {
    await pool.query(queries.get_single_notification(req.params.id), (err, result) => {
        if (err) throw err
        res.send(result.rows[0])
    })
})

router.patch('/:id', async (req, res) => {
    await pool.query(queries.patch_seen_notification(req.params.id), (err) => {
        if (err) throw err
        res.send('OK')
    })
})


module.exports = router