const express = require('express')
const { param } = require('express/lib/request');
const axios = require('axios')
const app = express()

app.use(require('cors')())

const tokenEndpoint = "http://localhost:8080/realms/facebook_clone/protocol/openid-connect/token"

const apiProtectedEnpoint = "http://localhost:5000/api/protected/profiles"

const clientId = "post_manager"
const clientSecret = "vLdnQXcikJzh1RrcFDxveu7C9DodL6JY"

app.get('/', async (req, res) => {
    const params = new URLSearchParams()

    params.append('grant_type', 'client_credentials')
    params.append('client_id', clientId)
    params.append('client_secret', clientSecret)

    await axios.post(tokenEndpoint, params).then(async response => {

        const accessToken = response.data.access_token || ''

        await axios.post(apiProtectedEnpoint,{email: req.body.email}, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }).then(response => {
            res.send(response.data.rows)
        }).catch(error => console.error(error))
    }).catch(error => {
        res.status(401).send(error.response.data)
    })

})

app.listen(4001, () => console.log("Post manager listening on port 4001"))