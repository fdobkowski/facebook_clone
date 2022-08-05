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

router.get('/:id', async (req, res) => {
    await pool.query(queries.get_friendships(req.params.id), (err, result) => {
        if (err) throw err
        res.status(200).send(result.rows)
    })
})

router.delete('/', async (req, res) => {
    await pool.query(queries.delete_friendship(req.body), (err) => {
        if (err) throw err
        res.status(200)
    })
})

module.exports = router