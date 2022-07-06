const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const queries = require('./profile_queries')

router.post('/', async (req, res) => {
    await pool.query(queries.post_profile(req.body), (err, result) => {
        if (err) throw err
        res.status(200).send("OK")
    })
})

router.get("/:id", async (req, res) => {
    await pool.query(queries.get_single_profile(req.params.id), (err, result) => {
        if (err) throw err
        res.send(result.rows)
    })
})

router.delete("/:id", async (req, res) => {
    await pool.query(queries.delete_profile(req.params.id), (err) => {
        if (err) throw err
        res.send("User deleted")
    })
})

router.patch("/:id", async (req, res) => {
    await pool.query(queries.patch_profile(req.body), (err) => {
        if (err) throw err
        res.send("User updated")
    })
})

module.exports = router