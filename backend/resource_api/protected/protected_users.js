const { Router } = require('express')
const router = Router()
const pool = require('../Pool')
const { param } = require('express/lib/request')
const axios = require('axios')

const queries = require('./protected_users_queries')

const introspectionEndpoint = 'http://localhost:8080/realms/facebook_clone/protocol/openid-connect/token/introspect'
const userInfoEndpoint = 'http://localhost:8080/realms/facebook_clone/protocol/openid-connect/userinfo'

const ssrClientId = 'ssr_client'
const ssrClientSecret = 'C25HFakJ8BhBS8uB80Xa64mDOogOiEWI'

router.get('/', async (req, res) => {

    const accessToken = (req.headers.authorization || '').split(' ')[1] || '';

    const params = new URLSearchParams();
    params.append('client_id', ssrClientId);
    params.append('client_secret', ssrClientSecret);
    params.append('token', accessToken);

    await axios.post(introspectionEndpoint, params).then(async response => {
        if (response.data.active) {
            await pool.query(queries.get_users, (error, result) => {
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