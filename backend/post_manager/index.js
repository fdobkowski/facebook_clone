const express = require('express')
const { param } = require('express/lib/request');
const axios = require('axios')
const app = express()

app.use(require('cors')())
app.use(express.json())

const tokenEndpoint = 'http://localhost:8080/realms/facebook_clone/protocol/openid-connect/token'

const apiProtectedEnpoint = "http://localhost:5000/api/protected/profiles"

const clientId = "post_manager"
const clientSecret = "yRoOU4ZZkaudWFxKetReLWCR13FPndh6"

app.post('/', async (req, res) => {
    const params = new URLSearchParams()

    params.append('client_id', clientId)
    params.append('client_secret', clientSecret)
    params.append('grant_type', 'client_credentials')


    await axios.post(tokenEndpoint, params).then(async response => {

        const accessToken = response.data.access_token || ''

        await axios.post(apiProtectedEnpoint,{login: req.body.login}, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }).then(response => {
            res.send({id: response.data.rows[0].id})
        }).catch(error => console.error(error))
    }).catch(error => {
        res.status(401).send(error)
    })

})

app.listen(4001, () => console.log("Post manager listening on port 4001"))