const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const queries = require('./profile_queries')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
    await pool.query(queries.get_all_profiles, (err, result) => {
        if (err) throw err
        res.status(200).send(result.rows)
    })
})

router.get('/auth', async (req, res) => {
    const token = (req.headers.authorization || "").split(" ")[1] || ""

    jwt.verify(token, process.env.HASH_KEY, (err, user) => {
        if (err) return res.sendStatus(403)
        res.send(user)
    })
})

router.post('/', async (req, res) => {
    await pool.query(queries.post_profile(req.body), (err, result) => {
        if (err) throw err
        res.status(200).send("OK")
    })
})

router.get("/:id", async (req, res) => {
    await pool.query(queries.get_single_profile(req.params.id), (err, result) => {
        if (err) throw err
        res.send(result.rows[0])
    })
})

router.delete("/:id", async (req, res) => {
    await pool.query(queries.delete_profile(req.params.id), (err) => {
        if (err) throw err
        res.send("User deleted")
    })
})

router.patch("/:id", async (req, res) => {
    await pool.query(queries.update_image(req.params.id, req.body.url), (err) => {
        if (err) throw err
        res.send("User updated")
    })
})

router.patch("/:id/data", async (req, res) => {
    await pool.query(queries.patch_profile(req.params.id, req.body), (err) => {
        if (err) throw err
        res.send('User updated')
    })
})

module.exports = router