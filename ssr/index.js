const express = require('express')
const axios = require('axios')
const { param } = require('express/lib/request')
const pkce = require('pkce-challenge').default()

const app = express()

const authEndpoint = 'http://localhost:8080/realms/facebook_clone/protocol/openid-connect/auth'
const tokenEndpoint = 'http://localhost:8080/realms/facebook_clone/protocol/openid-connect/token'

const apiEndpoint = 'http://localhost:5000/api/protected/users'

const clientId = 'ssr_client'
const clientSecret = 'C25HFakJ8BhBS8uB80Xa64mDOogOiEWI'

const codeChallenge = '9uo02hIHiWlmcCiDnVVRo-VijiHq0Q4d-470M6Z6Bm8'
const codeVerifier = '5552cfffd26c9c6705028b8390ff708ea2ca2a3e05a5cb7ec2e49fff'

const redirectUri = 'http://localhost:4000/protected'

const authRequest = `${authEndpoint}?
response_type=code&
client_id=${clientId}&
state=1234&
redirect_uri=http://localhost:4000/protected&
code_challenge=${codeChallenge}&
code_challenge_method=S256`;

app.use((req, res, next) => {
    console.log('------HEADERS-------')
    console.log(req.headers)
    console.log('------PARAMS--------')
    console.log(req.query)
    next()
})

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html')
    res.send(`
        <!DOCTYPE html>
        <body>
        <div>
            <a href="${authRequest}">Login</a>
        </div>
        </body>
        </html>
    `)
})

let accessToken = ''

app.get('/protected', (req, res) => {
    const params = new URLSearchParams()

    params.append('grant_type', 'authorization_code')
    params.append('redirect_uri', redirectUri)
    params.append('client_it', clientId)
    params.append('client_secret', clientSecret)
    params.append('code_verifier', codeVerifier)
    params.append('code', req.query.code)

    axios.post(tokenEndpoint, params).then(response => {
        accessToken = response.data.access_token || ''
        axios.get(apiEndpoint, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }).then(response => {
            
        }).catch(error => console.error(error))
    })
})

app.listen(4000, () => console.log("SSR app listening on port 4000"))