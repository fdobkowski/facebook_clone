const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.send("user api")
})

module.exports = router