# Facebook clone
> Prosty klon facebook'a zabezpieczony standardem OAuth/OpenID Connect

## Spis treści

- [Wstęp](#wstęp)
- [Technologie](#technologie)
- [Instalacja](#instalacja)
- [Flow aplikacji](#flow-aplikacji)

## Wstęp

Aplikacja dzieli się na 5 części:
- (Authorization Server wg OAuth) Keycloak
- (Resource Sever wg OAuth) Api połączone z bazą danych
- (Client wg OAuth) program pobierający dane z api
- (Client wg OAuth) inny program pobierający dany z api
- (Client wg OAuth) aplikacja reactowa korzystająca z api

## Technologie

##### Api
- axios - v0.27.2
- cors - v2.8.5
- express - v4.18.1
- pg - v8.7.3
- crypto-js - v4.1.1

##### Baza danych
- PostgreSQL - v14.2

##### Frontend
- ReactJS - v18.1.0
- Formik - v2.2.9
- Keycloak-js - v18.0.1
- React-router-dom - v6.3.0
- uuid - v8.3.2
- react-cookie - v4.1.1

## Instalacja

##### (1) Docker

Należy uruchomić aplikacje `docker desktop`, a następnie wykonać komendy:
- `docker run --name postgres -e POSTGRES_PASSWORD=password -d -p 5432:5432 postgres:14`
- `docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:18.0.0 start-dev`

##### (2) Api
Do uruchomienia api wystarczy komenda `node index.js` w katalogu `/backend/resource_api`

##### (3) Klienty

Do uruchomienia klientów należy wykonać komendy:

Dla aplikacji reactowej (w katalogu `frontend`):
- `yarn start`

Dla aplikacji SSR (w katalogu `ssr`):
- `node index.js`

Dla drugiej aplikacji backendowej (w katalogu `backend/post_manager`):
- `node index.js`

## Flow aplikacji

##### (1) SSR

Konfiguracja keycloaka:

!["kc1"](assets/keycloak(1).png)
!["kc2"](assets/keycloak(2).png)

Konfiguracja parametrów:

```javascript
const authEndpoint = 'http://localhost:8080/realms/facebook_clone/protocol/openid-connect/auth'
const tokenEndpoint = 'http://localhost:8080/realms/facebook_clone/protocol/openid-connect/token'

const apiEndpoint = 'http://localhost:5000/api/protected/users'

const clientId = 'ssr_client'
const clientSecret = 'C25HFakJ8BhBS8uB80Xa64mDOogOiEWI'

const codeChallenge = pkce.code_challenge
const codeVerifier = pkce.code_verifier

const redirectUri = 'http://localhost:4000/protected'

const authRequest = `${authEndpoint}?
response_type=code&
client_id=${clientId}&
state=1234&
redirect_uri=http://localhost:4000/protected&
code_challenge=${codeChallenge}&
code_challenge_method=S256`;
```

`codeChallenge` oraz `codeVerifier` są generowane automatycznie za pomocą biblioteki `pkce-challenge`.

```javascript
 const params = new URLSearchParams()

    params.append('grant_type', 'authorization_code')
    params.append('redirect_uri', redirectUri)
    params.append('client_id', clientId)
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
            res.set('Content-Type', 'text/html')
            res.send(html.protected_data(response.data.rows))
        }).catch(error => console.error(error))
    }).catch(error => console.error(error))
```

!["kc3"](assets/keycloak(3).png)


!["kc4"](assets/keycloak(4).png)


!["kc5"](assets/keycloak(5).png)

##### (2) Aplikacja Reactowa

Konfiguracja keycloak'a:

!["kc6"](assets/keycloak(6).png)


Konfiguracja reacta:

```javascript
const _kc = new Keycloak({
    url: "http://localhost:8080",
    realm: "facebook_clone",
    clientId: "spa_client",
    flow: 'implicit'
})
```

```javascript
const { keycloak } = useKeycloak()
const { authenticated } = keycloak


const handleLogin = useCallback(() => {
    keycloak.login()
}, [keycloak])

useEffect(() => {
    if (keycloak.token) {
        axios.get('http://localhost:5000/api/protected/posts', {
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        }).then(response => {
            setData(response.data)
        }).catch(err => console.error(err))
    }}, [keycloak.token])
```

Konfiguracja api do Implicit Grant:

```javascript
const spaClientId = 'spa_client'
const jwt = require('jsonwebtoken')
const realmPemCert = `-----BEGIN CERTIFICATE-----
MIICqzCCAZMCBgGByt4hjjANBgkqhkiG9w0BAQsFADAZMRcwFQYDVQQDDA5mYWNlYm9va19jbG9uZTAeFw0yMjA3MDQyMDE3NDRaFw0zMjA3MDQyMDE5MjRaMBkxFzAVBgNVBAMMDmZhY2Vib29rX2Nsb25lMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr/rEZx4PnEyU6WppVw2D1PiXjAioJe3tiO1QET2U5mWlKwRSxYKB872PcCz+mbPdz8YZZ6CL/+l5nggyybeJhhTDym2QxodJ8SXTQa9r+pKuD644qt7P7HhYR9Cmkmv6GPyAFvDPrJqstrSDvavRi6G7AdFYAZ/2q7uhyzuSoTopwKafmqhqwV73k2hF9rjLD7z5ApOIORrJQ9kJ4qxkfYK7py7FI2nGo5mrmL5YpbuaaCLdVL3eN0z0/g8cuhji44MtDm5wRH8ISXAEtYxesXRA6byWp+wzd+W3FnH436NMEwKsNAHkM/vFQJKhmA1j3Bk9tfKI8vkTPrgLn6OpxwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQCLI3d6byiU+rFvOkzLV1dfroO+qOLOvi1otm8bno/Ut+jOwLyUFcr118iTsGwuwqI0Zmy7i24JfMGVYL5XfLSKseFHYPVCvesvG31wLBuzNXIuDNlpbXZrtJeF1+RlX8K7i749pVKMTmU5Me/m937GGYhfuLxM/e7GmOIbfYGfwDKLa2JQSWGGo90QwLWwmWzqx7EU3EoUf7dGoupWJZPJx9HTzJkm9dZetpUUJ1vCfGy+1z1bUZTuSdKkKRueSr0LpaHq0DWYgMn6SDSh8ygGA97E+nbUsdaPOO31nvcdxjFl6q5PcRcaxCMCCVQZStBUC7jI/wWRL2X1507fRYmR
-----END CERTIFICATE-----`
```

```javascript
const accessToken = (req.headers.authorization || '').split(' ')[1] || '';
if (!accessToken) {
    return res.status(401).end();
}

const payload = jwt.verify(accessToken, realmPemCert, { algorithms: ['RS256']})

if (payload.exp < Date.now()) {
    pool.query(queries.get_posts, (err, result) => {
        if (err) throw err
        res.status(200).send(result.rows)
    })
} else res.status(401).end()
```

Flow aplikacji:

Aplikacja posiada możliwość rejestracji (BasicAuth):

```javascript
const token = Buffer.from(`${id}:${values.email}:${values.number}:${values.password}`, 'utf8').toString('base64')

        await axios.get("http://localhost:5000/api/users", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(async () => {
            await axios.post("http://localhost:5000/api/profiles", {
                id: id,
                first_name: values.first_name,
                last_name: values.last_name,
                birthday: `${values.year}-${values.month}-${values.day}`,
                gender: values.gender,
                custom_gender: values.custom_gender,
                pronoun: values.pronoun
            }).then((response) => alert(response.data)).catch(error => console.error(error))
        }).catch(error => console.error(error))
```

Api (hasło jest hashowane):
```javascript
const base64auth = (req.headers.authorization || "").split(" ")[1] || ""
const [id, email, number, password] = Buffer.from(base64auth, "base64").toString().split(":")

const encrypt = CryptoJS.AES.encrypt(password, "274989hash")

await pool.query(queries.post_user({
    id: id,
    email: email,
    number: number,
    password: encrypt
}), (err, result) => {
    if (err) throw err
    res.status(200).send("Successful")
})
```

```javascript
const base64auth = (req.headers.authorization || "").split(" ")[1] || ""
const [login, password] = Buffer.from(base64auth, "base64").toString().split(":")

pool.query(queries.auth_user({login: login, password: password}), async (error, response) => {
    if (error) throw error
    const decrypt = CryptoJS.AES.decrypt(response.rows[0].password, '274989hash')
    if (password === decrypt.toString(CryptoJS.enc.Utf8)) {
        await pool.query(queries.get_profile_id({login: login}), (error, response) => {
            if (error) throw error
            res.status(200).send(response.rows[0].id)
        })
    }
    else res.status(401).send("Wrong credentials")
})
```



!["kc7"](assets/keycloak(7).png)
!["kc8"](assets/keycloak(8).png)

Możliwość dodawania postów, które są dodawane przez api do bazy danych

!["kc9"](assets/keycloak(9).png)

Możliwość obejrzenia wszystkich informacji o postach dla "administratora"

```javascript
const handleLogin = useCallback(() => {
    keycloak.login()
}, [keycloak])
```

!["kc13"](assets/keycloak(13).png)

!["kc10"](assets/keycloak(10).png)

##### (3) Inna aplikacja backendowa

Konfiguracja keycloak'a:

!["kc11"](assets/keycloak(11).png)

Konfiguracja parametrów:

```javascript
const tokenEndpoint = 'http://localhost:8080/realms/facebook_clone/protocol/openid-connect/token'

const apiProtectedEnpoint = "http://localhost:5000/api/protected/profiles"

const clientId = "post_manager"
const clientSecret = "yRoOU4ZZkaudWFxKetReLWCR13FPndh6"
```

```javascript
const params = new URLSearchParams()

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
```

Zastosowanie backendu w aplikacji reactowej:

```javascript
const handleLogin = async (values) => {
        const token = Buffer.from(`${values.login}:${values.password}`, 'utf8').toString('base64')

        await axios.get("http://localhost:5000/api/login", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(async (response) => {
                await axios.post('http://localhost:4001', {
                    login: values.login
                }).then(response => {
                    setCookies("profile_id", response.data.id)
                    navigate('/')
                }).catch(error => console.log(error))
            }).catch(error => console.error(error))
    }
```

Backend służy do pobrania z zabezpieczonego api id użytkownika, który się zalogował i zapisanie go do cookies.

!["kc12"](assets/keycloak(12).png)