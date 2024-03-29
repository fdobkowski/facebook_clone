const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const queries = require('./post_queries')
const middleware = require('../authMiddleware')

router.post('/', async (req, res) => {
    await pool.query(queries.post_user(req.body), (err, result) => {
        if (err) throw err
        res.status(200).send("OK")
    })
})

router.get('/', async (req, res) => {
    await pool.query(queries.get_all_posts, (err, result) => {
        if (err) throw err
        res.status(200).send(result.rows)
    })
})

router.get("/:id", async (req, res) => {
    await pool.query(queries.get_single_post(req.params.id), (err, result) => {
        if (err) throw err
        res.send(result.rows)
    })
})


router.delete("/:id", middleware, async (req, res) => {
    await pool.query(queries.delete_post(req.params.id), (err) => {
        if (err) throw err
        res.send("Post deleted")
    })
})


module.exports = router