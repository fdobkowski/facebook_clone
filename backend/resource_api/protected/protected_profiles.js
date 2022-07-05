const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const { param } = require('express/lib/request')
const axios = require('axios')

const queries = require('./protected_profiles_queries')

const introspectionEndpoint = 'http://localhost:8080/realms/facebook_clone/protocol/openid-connect/token/introspect'
const userInfoEndpoint = 'http://localhost:8080/realms/facebook_clone/protocol/openid-connect/userinfo'

const postId = 'post_manager'
const postSecret = 'vLdnQXcikJzh1RrcFDxveu7C9DodL6JY'

router.post('/', async (req, res) => {

    const accessToken = (req.headers.authorization || '').split(' ')[1] || '';

    const params = new URLSearchParams();
    params.append('client_id', postId);
    params.append('client_secret', postSecret);
    params.append('token', accessToken);

    await axios.post(introspectionEndpoint, params).then(async response => {
        if (response.data.active) {
            await pool.query(queries.get_profile_id(req.body), (error, result) => {
                if (error) throw error
                res.status(200).send(result)
            })
        } else res.status(401).send({error: 'Invalid token'})
    }).catch(error => {
        console.error(error)
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify({error: "Some other error"}))
    })

})

module.exports = router